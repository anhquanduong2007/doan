import { createSlice } from '@reduxjs/toolkit';
import { Cart } from 'src/types';

interface CartState {
    addToCart: {
        result: Cart | null;
        loading: boolean;
        error: boolean;
    },
    listProductOnCart: {
        result: Cart[] | null;
        loading: boolean;
        error: boolean;
    }
}

const initialState: CartState = {
    addToCart: {
        result: null,
        loading: false,
        error: false
    },
    listProductOnCart: {
        result: null,
        loading: false,
        error: false
    }
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
        getListProductOnCartStart: (state) => {
            state.listProductOnCart.loading = true;
        },
        getListProductOnCartSuccess: (state, action) => {
            state.listProductOnCart.loading = false;
            state.listProductOnCart.result = action.payload;
            state.listProductOnCart.error = false
        },
        getListProductOnCartFailed: (state, action) => {
            state.listProductOnCart.loading = false;
            state.listProductOnCart.result = action.payload;
            state.listProductOnCart.error = true;
        },
    },
});

export const {
    addToCartStart,
    addToCartSuccess,
    addToCartFailed,
    getListProductOnCartStart,
    getListProductOnCartSuccess,
    getListProductOnCartFailed
} = cartSlice.actions;

export default cartSlice.reducer;