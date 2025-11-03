import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { authApi } from "../api/authApi";

const initialState = {
	user: JSON.parse(localStorage.getItem('user')) || null,
	isAuthenticated: !!localStorage.getItem('token'),
	token: localStorage.getItem('token'),
	loading: false,
	error: null
}

const authSlice = createSlice({
	name: 'auth',
  	initialState,
	reducers: {
		logout: (state) => {
		state.isAuthenticated = false;
		state.user = null;
		state.token = null;
		localStorage.removeItem('token');
		localStorage.removeItem('user');
		},
		clearError: (state) => {
		state.error = null;
		},
		setCredentials: (state, action) => {
		state.user = action.payload.user;
		state.token = action.payload.token;
		state.isAuthenticated = true;
		localStorage.setItem('token', action.payload.token);
		localStorage.setItem('user', JSON.stringify(action.payload.user));
		}
	},
	extraReducers: (builder) => {
		builder
			.addMatcher(
				authApi.endpoints.login.matchFulfilled,
				(state, action) => {
				state.loading = false;
				state.isAuthenticated = true;
				state.user = action.payload.user;
				state.token = action.payload.token;
				localStorage.setItem('token', action.payload.token);
				localStorage.setItem('user', JSON.stringify(action.payload.user));
				}
			)
			.addMatcher(
				authApi.endpoints.login.matchRejected,
				(state, action) => {
				state.loading = false;
				state.error = action.payload?.data?.message || 'Login failed';
				state.isAuthenticated = false;
				}
			)
			.addMatcher(
				authApi.endpoints.register.matchFulfilled,
				(state, action) => {
				state.loading = false;
				state.isAuthenticated = true;
				state.user = action.payload.user;
				state.token = action.payload.token;
				localStorage.setItem('token', action.payload.token);
				localStorage.setItem('user', JSON.stringify(action.payload.user));
				}
			)
			.addMatcher(
				authApi.endpoints.getCurrentUser.matchFulfilled,
				(state, action) => {
				state.user = action.payload;
				state.isAuthenticated = true;
				}
			)
			.addMatcher(
				(action) => action.type.endsWith('/pending'),
				(state) => {
				state.loading = true;
				state.error = null;
				}
			)
			.addMatcher(
				(action) => action.type.endsWith('/rejected'),
				(state, action) => {
				state.loading = false;
				state.error = action.payload?.data?.message || 'An error occurred';
				}
			);
	}
});

export const {
	logout,
	clearError,
	setCredentials
} = authSlice.actions;

export default authSlice.reducer;