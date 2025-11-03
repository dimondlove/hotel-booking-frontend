import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const API_BASE_URL = 'http://localhost:8080/api';

export const bookingApi = createApi({
     reducerPath: 'bookingApi',
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
    tagTypes: ['Bookings'],
    endpoints: (builder) => ({
        // Бронирования пользователя
        getUserBookings: builder.query({
            query: () => '/bookings/my',
            providesTags: ['Bookings'],
        }),
        getActiveBookings: builder.query({
            query: () => '/bookings/my/active',
            providesTags: ['Bookings'],
        }),
        getBookingById: builder.query({
            query: (id) => `/bookings/${id}`,
            providesTags: (result, error, id) => [{ type: 'Bookings', id }],
        }),
        createBooking: builder.mutation({
            query: (bookingData) => ({
                url: '/bookings',
                method: 'POST',
                body: bookingData,
            }),
            invalidatesTags: ['Bookings'],
        }),
        cancelBooking: builder.mutation({
            query: (id) => ({
                url: `/bookings/${id}/cancel`,
                method: 'POST',
            }),
            invalidatesTags: ['Bookings'],
        }),

        // Административные функции
        getHotelBookings: builder.query({
            query: (hotelId) => `/bookings/hotel/${hotelId}`,
            providesTags: ['Bookings'],
        }),
        getBookingsByStatus: builder.query({
            query: (status) => `/bookings/status/${status}`,
            providesTags: ['Bookings'],
        }),
        updateBookingStatus: builder.mutation({
            query: ({ id, status }) => ({
                url: `/bookings/${id}/status`,
                method: 'PATCH',
                params: { status },
            }),
            invalidatesTags: ['Bookings'],
        }),
    }),
});

export const {
    useGetUserBookingsQuery,
    useGetActiveBookingsQuery,
    useGetBookingByIdQuery,
    useCreateBookingMutation,
    useCancelBookingMutation,
    useGetHotelBookingsQuery,
    useGetBookingsByStatusQuery,
    useUpdateBookingStatusMutation,
} = bookingApi;