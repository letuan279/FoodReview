import axios from "./axios"

export const checkAuth = async () => {
    try {
        const response = await axios.get('/user')
        if (response.data.success === 'true') return response.data
    } catch (error) {
        return { success: 'false', message: error.message }
    }
}

export const setAuthHeader = (token) => {
    if (token) {
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
    } else {
        delete axios.defaults.headers.common['Authorization']
    }
}

export const loginAPI = async (loginFormData) => {
    try {
        const response = await axios.post('/login', loginFormData)
        return response.data
    } catch (error) {
        return { success: 'false', message: error.message }
    }
}

export const registerAPI = async (registerFormData) => {
    try {
        const response = await axios.post('/register', registerFormData)
        return response.data
    } catch (error) {
        return { success: 'false', message: error.message }
    }
}

export const logoutAPI = async () => {
    try {
        const response = await axios.get('/logout')
        return response.data
    } catch (error) {
        return { success: 'false', message: error.message }
    }
}