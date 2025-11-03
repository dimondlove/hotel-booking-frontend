import { createSlice } from "@reduxjs/toolkit";
import { bookingApi } from "../api/bookingApi";

const initialState = {
    currentBooking: null, // Исправлена опечатка (было currenBooking)
    loading: false,
    error: null
}

const bookingSlice = createSlice({
    name: 'booking',
    initialState,
    reducers: {
        setCurrentBooking: (state, action) => {
            state.currentBooking = action.payload;
        },
        clearCurrentBooking: (state) => {
            state.currentBooking = null;
        },
        setLoading: (state, action) => {
            state.loading = action.payload;
        },
        setError: (state, action) => {
            state.error = action.payload;
        },
        clearError: (state) => {
            state.error = null;
        }
    },
    extraReducers: (builder) => {
        builder
            // Обрабатываем создание бронирования
            .addMatcher(
                bookingApi.endpoints.createBooking.matchPending,
                (state) => {
                    state.loading = true;
                    state.error = null;
                }
            )
            .addMatcher(
                bookingApi.endpoints.createBooking.matchFulfilled,
                (state, action) => {
                    state.loading = false;
                    state.currentBooking = action.payload;
                }
            )
            .addMatcher(
                bookingApi.endpoints.createBooking.matchRejected,
                (state, action) => {
                    state.loading = false;
                    state.error = action.payload?.data?.message || 'Failed to create booking';
                }
            )
            // Обрабатываем отмену бронирования
            .addMatcher(
                bookingApi.endpoints.cancelBooking.matchPending,
                (state) => {
                    state.loading = true;
                    state.error = null;
                }
            )
            .addMatcher(
                bookingApi.endpoints.cancelBooking.matchFulfilled,
                (state) => {
                    state.loading = false;
                    state.currentBooking = null;
                }
            )
            .addMatcher(
                bookingApi.endpoints.cancelBooking.matchRejected,
                (state, action) => {
                    state.loading = false;
                    state.error = action.payload?.data?.message || 'Failed to cancel booking';
                }
            );
    }
})

export const {
    setCurrentBooking,
    clearCurrentBooking,
    setLoading,
    setError,
    clearError
} = bookingSlice.actions;

export default bookingSlice.reducer;