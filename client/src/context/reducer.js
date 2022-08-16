import {
    SET_AUTH_BEGIN,
    SET_AUTH_SUCCESS,
    SET_AUTH_FAILED
} from "./action"

export const AuthReducer = (state, action) => {

    switch (action.type) {
        case SET_AUTH_BEGIN:
            return {
                ...state,
                isLoading: true
            }
        case SET_AUTH_FAILED:
            return {
                ...state,
                isLoading: false,
                user: null,
                isAuthenticated: false
            }
        case SET_AUTH_SUCCESS:
            return {
                ...state,
                isLoading: false,
                isAuthenticated: true,
                ...action.payload
            }
        case 'SET_DATA':
            return {
                ...state,
                ...action.payload
            }
        case 'SET_LIKE':
            return {
                ...state,
                posts: state.posts.map((post) => {
                    if (post.post_id === action.payload.post_id) {
                        return {
                            ...post,
                            liked: action.payload.action === 'like' ? '1' : '0',
                            numLike: action.payload.action === 'like' ? (parseInt(post.numLike) + 1).toString() : (parseInt(post.numLike) - 1).toString()
                        }
                    }
                    return post
                }),
                myPosts: state.myPosts.map((post) => {
                    if (post.post_id === action.payload.post_id) {
                        return {
                            ...post,
                            liked: action.payload.action === 'like' ? '1' : '0',
                            numLike: action.payload.action === 'like' ? (parseInt(post.numLike) + 1).toString() : (parseInt(post.numLike) - 1).toString()
                        }
                    }
                    return post
                })
            }
        case 'SET_COMMENT':
            return {
                ...state,
                posts: state.posts.map((post) => {
                    if (post.post_id === action.payload.post_id) {
                        return {
                            ...post,
                            numComment: (parseInt(post.numComment) + 1).toString()
                        }
                    }
                    return post
                }),
                myPosts: state.myPosts.map((post) => {
                    if (post.post_id === action.payload.post_id) {
                        return {
                            ...post,
                            numComment: (parseInt(post.numComment) + 1).toString()
                        }
                    }
                    return post
                })
            }
        default:
            throw new Error("Action not match")
    }
}