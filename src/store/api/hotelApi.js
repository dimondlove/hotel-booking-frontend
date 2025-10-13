import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const hotelApi = createApi({
    reducerPath: 'hotelApi',
    baseQuery: fetchBaseQuery({
        baseUrl: '/api',
        prepareHeaders: (headers, { getState }) => {
            const token = getState().auth.token
            if (token) {
                headers.set('authorization', `Bearer ${token}`)
            }
            return headers
        },
    }),
    tagTypes: ['Hotels', 'Rooms', 'Bookings'],
    endpoints: (builder) => ({
        getHotels: builder.query({
            query: () => '/hotels',
            providesTags: ['Hotels'],
        }),
        getHotelById: builder.query({
            query: (id) => `/hotels/${id}`,
        }),
    })
})

export const {
    // Хуки будут добавлены после реализации бэкенда
} = hotelApi