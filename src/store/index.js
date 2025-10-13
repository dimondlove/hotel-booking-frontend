import { configureStore } from "@reduxjs/toolkit";
import authReducer from './slices/authSlice'
import bookingReducer from './slices/bookingSlice'
import { hotelApi } from "./api/hotelApi";

export const store = configureStore({
    reducer: {
        auth: authReducer,
        booking: bookingReducer,
        [hotelApi.reducerPath]: hotelApi.reducer,
    },
    middleware: (getDefaultMiddlewate) => 
        getDefaultMiddlewate().concat(hotelApi.middleware),
})

export default store