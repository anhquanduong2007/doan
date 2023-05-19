import { createSlice } from '@reduxjs/toolkit';

interface CartState {
    addToCart: {
        result: any | null;
        loading: boolean;
        error: boolean;
    },
}

const initialState: CartState = {
    addToCart: {
        result: null,
        loading: false,
        error: false
    },
} as CartState;

export const cartSlice = createSlice({
    name: 'cart',
    initialState,
    reducers: {
        addToCartStart: (state) => {
            state.addToCart.loading = true;
        },
        addToCartSuccess: (state, action) => {
            state.addToCart.loading = false;
            state.addToCart.result = action.payload;
            state.addToCart.error = false
        },
        addToCartFailed: (state, action) => {
            state.addToCart.loading = false;
            state.addToCart.result = action.payload;
            state.addToCart.error = true;
        },
    },
});

export const {
    addToCartStart,
    addToCartSuccess,
    addToCartFailed,
} = cartSlice.actions;

export default cartSlice.reducer;