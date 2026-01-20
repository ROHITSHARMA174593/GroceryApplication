import { configureStore } from "@reduxjs/toolkit";
import { userSlice } from './userslice'
import { cartSlice } from "./cartslice";

export const store = configureStore({
    reducer: {
        user: userSlice.reducer,
        cart:cartSlice.reducer
    }
})


export type RootState = ReturnType<typeof store.getState>


export type AppDispatch = typeof store.dispatch
