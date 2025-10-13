import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    user: null,
    isAuthenticated: false,
    token: localStorage.getItem('token'),
    loading: false,
    error: null
}

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        loginStart: (state) => {
            state.loading = true
            state.error = null
        },
        loginSuccess: (state, action) => {
            state.loading = false
            state.isAuthenticated = true
            state.user = action.payload.user
            state.token = action.payload.token
            localStorage.setItem('token', action.payload.token)
             localStorage.setItem('user', JSON.stringify(action.payload.user))
        },
        loginFailure: (state, action) => {
            state.loading = false
            state.error = action.payload
            state.isAuthenticated = false
            state.user = null
            state.token = null
            localStorage.removeItem('token')
        },
        logout: (state) => {
            state.isAuthenticated = false
            state.user = null
            state.token = null
            localStorage.removeItem('token')
        },
        clearError: (state) => {
            state.error = null
        }
    }
})

export const {
    loginStart,
    loginSuccess,
    loginFailure,
    logout,
    clearError
} = authSlice.actions

export default authSlice.reducer