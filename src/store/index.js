import { configureStore } from "@reduxjs/toolkit";
import authReducer from './slices/authSlice'
import bookingReducer from './slices/bookingSlice'
import { hotelApi } from "./api/hotelApi";
import { authApi } from "./api/authApi";
import { bookingApi } from "./api/bookingApi";

export const store = configureStore({
    reducer: {
        auth: authReducer,
        booking: bookingReducer,
        [hotelApi.reducerPath]: hotelApi.reducer,
        [authApi.reducerPath]: authApi.reducer,
        [bookingApi.reducerPath]: bookingApi.reducer,
    },
    middleware: (getDefaultMiddlewate) => 
        getDefaultMiddlewate()
            .concat(hotelApi.middleware)
            .concat(authApi.middleware)
            .concat(bookingApi.middleware),
})

export default store