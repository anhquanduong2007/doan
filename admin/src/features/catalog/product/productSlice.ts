import { createSlice } from '@reduxjs/toolkit';
import { ErrorValidateResponse } from 'src/types';

export interface ProductType {
    id: number
    created_at: string
    updated_at: string
    name: string
    slug: string
    description: string
    active: boolean
}

export interface ProductOptionType {
    name: string
    value: Array<string>
}

interface ProductState {
    createProduct: {
        result: ProductType | ErrorValidateResponse | null;
        loading: boolean;
        error: boolean;
    },
    createProductOption: {
        result: any;
        loading: boolean;
        error: boolean;
    }
}

const initialState: ProductState = {
    createProduct: {
        result: null,
        loading: false,
        error: false,
    },
    createProductOption: {
        result: null,
        loading: false,
        error: false,
    }
} as ProductState;

export const productSlice = createSlice({
    name: 'product',
    initialState,
    reducers: {
        // ** Create product
        createProductStart: (state) => {
            state.createProduct.loading = true;
        },
        createProductSuccess: (state, action) => {
            state.createProduct.loading = false;
            state.createProduct.result = action.payload;
            state.createProduct.error = false
        },
        createProductFailed: (state, action) => {
            state.createProduct.loading = false;
            state.createProduct.result = action.payload;
            state.createProduct.error = true;
        },
         // ** Create product option
        createProductOptionStart: (state) => {
            // state.createProductOption.loading = true;
        },
        // createProductOptionSuccess: (state, action) => {
        //     // state.createProductOption.loading = false;
        //     // state.createProductOption.result = action.payload;
        //     // state.createProductOption.error = false
        // },
        // createProductOptionFailed: (state, action) => {
        //     // state.createProductOption.loading = false;
        //     // state.createProductOption.result = action.payload;
        //     // state.createProductOption.error = true;
        // },
    }
});

export const {
    createProductStart,
    createProductSuccess,
    createProductFailed,
    createProductOptionStart
    // createProductOptionSuccess,
    // createProductOptionFailed
} = productSlice.actions;

export default productSlice.reducer;