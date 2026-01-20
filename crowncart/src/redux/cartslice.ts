import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import mongoose from "mongoose";

 interface IGrocery{
    _id?: mongoose.Types.ObjectId,
    name : string,
    category: string,
    price: number,
    image: string,
    quantity: number,
    unit: number,
    createdAt: Date,
    updatedAt: Date,
}

interface ICartSlice{
    cartData: IGrocery[]
}

const initialState :ICartSlice = {
    cartData: []
}

export const cartSlice = createSlice({
    name: "cartData",
    initialState,
    reducers:{
        addToCart:(state,action:PayloadAction<IGrocery>) => {
            const existingItem = state.cartData.find(item => item._id === action.payload._id)
            if(existingItem){
                existingItem.quantity += 1
            } else {
                state.cartData.push(action.payload)
            }
        },
        incrementQuantity:(state, action:PayloadAction<mongoose.Types.ObjectId>) => {
            const item = state.cartData.find(item => item._id === action.payload)
            if(item){
                item.quantity += 1
            }
        },
        decrementQuantity:(state, action:PayloadAction<mongoose.Types.ObjectId>) => {
             const item = state.cartData.find(item => item._id === action.payload)
            if(item){
                if(item.quantity > 1){
                    item.quantity -= 1
                } else {
                     state.cartData = state.cartData.filter(item => item._id !== action.payload)
                }
            }
        },
        removeFromCart:(state, action:PayloadAction<mongoose.Types.ObjectId>) => {
             state.cartData = state.cartData.filter(item => item._id !== action.payload)
        },
        clearCart:(state) => {
            state.cartData = []
        }
    }
})

export const {addToCart, incrementQuantity, decrementQuantity, removeFromCart, clearCart} = cartSlice.actions
export default cartSlice.reducer;