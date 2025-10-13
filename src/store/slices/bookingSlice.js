import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    currenBooking: null,
    bookings: [],
    loading: false,
    error: null
}

const bookingSlice = createSlice({
    name: 'booking',
    initialState,
    reducers: {
        setCurrentBooking: (state, action) => {
            state.currenBooking = action.payload
        },
        clearCurrentBooking: (state) => {
            state.currenBooking = null
        },
        addBooking: (state, action) => {
            state.bookings.push(action.payload)
        },
        setBookings: (state, action) => {
            state.bookings = action.payload
        },
        setLoading: (state, action) => {
            state.loading = action.payload
        },
        setError: (state, action) => {
            state.error = action.payload
        },
        clearError: (state) => {
            state.error = null
        }
    }
})

export const {
    setCurrentBooking,
    clearCurrentBooking,
    addBooking,
    setBookings,
    setLoading,
    setError,
    clearError
} = bookingSlice.actions

export default bookingSlice.reducer