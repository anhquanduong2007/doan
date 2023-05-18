import { createSlice, createAsyncThunk, PayloadAction, AnyAction } from '@reduxjs/toolkit';
import axiosClient from '../../axios/axios'
import { API_ENDPOINTS } from '../../shared/constants/endpoints'
import { IResponse } from 'src/shared/api/types';

// Define a type for the slice state
export interface ProductState {
  name: string
  list: {
    loading: boolean
    error: string
    data: any
  },
  detail: {
    loading: boolean,
    error: string,
    data: any
  },
  listCart: {
    loading: boolean,
    error: string,
    data: any
  },
  addCart: {
    loading: boolean,
    error: string,
    data: any
  }
}

// Define the initial state using that type
const initialState: ProductState = {
  name: 'appProduct',
  list: {
    loading: false,
    error: '',
    data: null
  },
  detail: {
    loading: false,
    error: '',
    data: null
  },
  listCart: {
    loading: false,
    error: '',
    data: null
  },
  addCart: {
    loading: false,
    error: '',
    data: null
  },
}

export const products = createAsyncThunk('appProduct/products', async (input: any, { rejectWithValue, fulfillWithValue }) => {
  try {
    const { take, skip } = input
    const response: any = await axiosClient.get(API_ENDPOINTS.PRODUCTS, {
      params: {
        skip,
        take
      }
    })
    return fulfillWithValue(response.response);
  } catch (error: any) {
    return rejectWithValue(error.response.data)
  }
})

export const productDetail = createAsyncThunk('appProduct/productDetail', async (id: number, { rejectWithValue, fulfillWithValue }) => {
  try {
    const response: any = await axiosClient.get(`${API_ENDPOINTS.PRODUCT_DETAIL}/${id}`)
    return fulfillWithValue(response.response);
  } catch (error: any) {
    return rejectWithValue(error.response.data)
  }
})

export const addToCart = createAsyncThunk('appProduct/addToCart', async (input: { quantity: number, idProductVariant: number }, { rejectWithValue, fulfillWithValue }) => {
  try {
    const { quantity, idProductVariant } = input
    const response: any = await axiosClient.post(`${API_ENDPOINTS.CART}/${idProductVariant}`, {
      quantity
    })
    return fulfillWithValue(response.response);
  } catch (error: any) {
    return rejectWithValue(error.response.data)
  }
})

export const getCarts = createAsyncThunk('appProduct/getCarts', async (input: number, { rejectWithValue, fulfillWithValue }) => {
  try {
    const response: any = await axiosClient.get(`${API_ENDPOINTS.CART}`)
    return fulfillWithValue(response.response);
  } catch (error: any) {
    return rejectWithValue(error.response.data)
  }
})

export const productSlice = createSlice({
  name: 'product',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(products.pending, (state: any) => {
        state.list.loading = true
      })
      .addCase(products.fulfilled, (state: any, action: PayloadAction<any>) => {
        state.list.loading = false
        state.list.data = action.payload
        state.list.error = false
      })
      .addCase(products.rejected, (state: any, action: PayloadAction<any>) => {
        state.list.loading = false
        state.list.data = action.payload
        state.list.error = true
      })
      .addCase(productDetail.pending, (state: any) => {
        state.detail.loading = true
      })
      .addCase(productDetail.fulfilled, (state: any, action: PayloadAction<any>) => {
        state.detail.loading = false
        state.detail.data = action.payload
        state.detail.error = false
      })
      .addCase(productDetail.rejected, (state: any, action: PayloadAction<any>) => {
        state.detail.loading = false
        state.detail.data = action.payload
        state.detail.error = true
      })
      .addCase(getCarts.pending, (state: any) => {
        state.listCart.loading = true
      })
      .addCase(getCarts.fulfilled, (state: any, action: PayloadAction<any>) => {
        state.listCart.loading = false
        state.listCart.data = action.payload
        state.listCart.error = false
      })
      .addCase(getCarts.rejected, (state: any, action: PayloadAction<any>) => {
        state.listCart.loading = false
        state.listCart.data = action.payload
        state.listCart.error = true
      })
      .addCase(addToCart.pending, (state: any) => {
        state.addCart.loading = true
      })
      .addCase(addToCart.fulfilled, (state: any, action: PayloadAction<any>) => {
        state.addCart.loading = false
        state.addCart.data = action.payload
        state.addCart.error = false
      })
      .addCase(addToCart.rejected, (state: any, action: PayloadAction<any>) => {
        state.addCart.loading = false
        state.addCart.data = action.payload
        state.addCart.error = true
      })
  }
});

export default productSlice.reducer;
