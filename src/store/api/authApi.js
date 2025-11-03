import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const API_BASE_URL = 'http://localhost:8080/api';

export const authApi = createApi({
    reducerPath: 'authApi',
    baseQuery: fetchBaseQuery({
        baseUrl: API_BASE_URL,
        prepareHeaders: (headers, { getState }) => {
            const token = getState().auth.token;
            if (token) {
                headers.set('authorization', `Bearer ${token}`);
            }
            headers.set('Content-Type', 'application/json');
            return headers;
        },
    }),
    tagTypes: ['Auth'],
    endpoints: (builder) => ({
        // 🔐 Аутентификация
        login: builder.mutation({
            query: (credentials) => ({
                url: '/auth/login',
                method: 'POST',
                body: credentials,
            }),
            invalidatesTags: ['Auth'],
        }),
        register: builder.mutation({
            query: (userData) => ({
                url: '/auth/register',
                method: 'POST',
                body: userData,
            }),
            invalidatesTags: ['Auth'],
        }),
        getCurrentUser: builder.query({
            query: () => '/auth/me',
            providesTags: ['Auth'],
        }),
        
        // 👨‍💼 Административные функции
        registerAdmin: builder.mutation({
            query: (userData) => ({
                url: '/auth/register-admin',
                method: 'POST',
                body: userData,
            }),
            invalidatesTags: ['Auth'],
        }),
        createFirstAdmin: builder.mutation({
            query: (userData) => ({
                url: '/auth/create-first-admin',
                method: 'POST',
                body: userData,
            }),
            invalidatesTags: ['Auth'],
        }),
    }),
});

export const {
    useLoginMutation,
    useRegisterMutation,
    useGetCurrentUserQuery,
    useRegisterAdminMutation,
    useCreateFirstAdminMutation,
} = authApi;