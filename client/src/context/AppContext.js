import { createContext, useContext, useEffect, useReducer, useState } from 'react'
import { checkAuth, setAuthHeader, loginAPI, registerAPI, logoutAPI } from '../api/auth'
import { AuthReducer } from './reducer'
import { message } from 'antd'
import {
    SET_AUTH_BEGIN,
    SET_AUTH_SUCCESS,
    SET_AUTH_FAILED
} from "./action"
import axios from '../api/axios'

const AppContext = createContext()

const initState = {
    isLoading: false,
    user: null,
    isAuthenticated: false,
    posts: [],
    myPosts: [],
    ranks: [],
    images: []
}

const AppContextProvider = ({ children }) => {

    const [authState, dispatch] = useReducer(AuthReducer, initState)
    const [select, setSelect] = useState(null)

    const loadUser = async () => {
        // console.log("load user");
        if (!localStorage['token']) {
            dispatch({
                type: SET_AUTH_FAILED
            })
            return
        }

        setAuthHeader(localStorage['token'])
        dispatch({
            type: SET_AUTH_BEGIN
        })

        const responseData = await checkAuth()
        if (responseData.success === 'true') {
            dispatch({
                type: SET_AUTH_SUCCESS,
                payload: {
                    user: responseData.user
                }
            })
        }
        if (responseData.success === 'false') {
            localStorage.removeItem('token')
            setAuthHeader(null)
            dispatch({
                type: SET_AUTH_FAILED
            })
        }
    }
    useEffect(() => loadUser(), [])

    const handleLogin = async (loginFormData) => {
        // validate
        const { username, password } = loginFormData
        if (!username || !password) {
            message.warning("Please fill in username and password")
            return
        }
        dispatch({
            type: SET_AUTH_BEGIN
        })
        // Call API
        const responseData = await loginAPI(loginFormData)
        if (responseData.success === 'true') {
            localStorage.setItem('token', responseData.token)
            setAuthHeader(localStorage['token'])
            dispatch({
                type: SET_AUTH_SUCCESS,
                payload: {
                    user: responseData.user
                }
            })
            message.success(responseData.message)
        }
        if (responseData.success === 'false') {
            dispatch({
                type: SET_AUTH_FAILED
            })
            message.error(responseData.message)
        }
    }

    const handleRegister = async (registerFormData) => {
        //validate
        const { nickname, username, password, rePassword } = registerFormData
        if (!nickname || !username || !password || !rePassword) {
            message.warning("Please fill in nickname, username, password and confirm password")
            return
        }
        if (password !== rePassword) {
            message.warning("Password and confirm password not match!")
            return
        }

        dispatch({
            type: SET_AUTH_BEGIN
        })
        // Call API
        const responseData = await registerAPI({ nickname, username, password })
        if (responseData.success === 'true') {
            message.success(responseData.message)
        }
        if (responseData.success === 'false') {
            message.error(responseData.message)
        }
        dispatch({
            type: SET_AUTH_FAILED
        })
    }

    const handleLogout = async () => {
        dispatch({
            type: SET_AUTH_BEGIN
        })
        const responseData = await logoutAPI()
        localStorage.removeItem('token')
        dispatch({
            type: SET_AUTH_FAILED
        })
        message.success(responseData.message)
    }

    const handleInfo = async () => {
        try {

            const getPosts = await axios.get('/posts')
            const getPostsData = getPosts.data
            // console.log(getPostsData.posts);

            const getRanks = await axios.get('/ranks')
            const getRanksData = getRanks.data
            // console.log(getRanksData.ranks);

            const myPost = await axios.get('/my-posts')
            const myPostData = myPost.data
            // console.log(myPostData.myPosts);

            const getImages = await axios.get('/images')
            const getImagesData = getImages.data
            // console.log(getImagesData.images);

            dispatch({
                type: 'SET_DATA',
                payload: {
                    posts: getPostsData.posts,
                    ranks: getRanksData.ranks,
                    myPosts: myPostData.myPosts,
                    images: getImagesData.images
                }
            })

        } catch (error) {
            message.error(error.message)
        }
    }

    const handleAddMyPost = async () => {
        const myPost = await axios.get('/my-posts')
        const myPostData = myPost.data
        const getImages = await axios.get('/images')
        const getImagesData = getImages.data
        const getPosts = await axios.get('/posts')
        const getPostsData = getPosts.data
        dispatch({
            type: 'SET_DATA',
            payload: {
                myPosts: myPostData.myPosts,
                images: getImagesData.images,
                posts: getPostsData.posts
            }
        })
    }

    const handleLikePost = async (post_id) => {
        try {
            const resLike = await axios.get(`/like-post/${post_id}`)
            const data = resLike.data
            dispatch({
                type: 'SET_LIKE',
                payload: {
                    post_id: post_id,
                    action: data.action
                }
            })
        } catch (error) {
            message.error(error.message)
        }
    }

    const increaseNumComment = (post_id) => {
        dispatch({
            type: 'SET_COMMENT',
            payload: {
                post_id
            }
        })
    }

    // console.log(authState);

    const data = {
        handleLogin,
        handleRegister,
        handleLogout,
        authState,
        handleInfo,
        handleAddMyPost,
        select,
        setSelect,
        handleLikePost,
        increaseNumComment
    }

    return (
        <AppContext.Provider value={data}>
            {children}
        </AppContext.Provider>
    )
}

const useAppContext = () => {
    return useContext(AppContext)
}

export default AppContextProvider

export { AppContext, useAppContext }
