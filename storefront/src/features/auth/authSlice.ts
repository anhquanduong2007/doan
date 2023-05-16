import { createSlice, createAsyncThunk, PayloadAction, AnyAction } from '@reduxjs/toolkit';
import axiosClient from '../../axios/axios'
import { API_ENDPOINTS } from '../../shared/constants/endpoints'
import { IResponse } from 'src/shared/api/types';

// Define a type for the slice state
export interface AuthState {
  name: string
  isLogin: boolean
  login: {
    loading: boolean
    error: string
    data: any
  },
  register: {
    loading: boolean,
    error: string,
    data: any
  }
}

// Define the initial state using that type
const initialState: AuthState = {
  name: 'appAuth',
  isLogin: false,
  login: {
    loading: false,
    error: '',
    data: null
  },
  register: {
    loading: false,
    error: '',
    data: null
  }
}

export const login = createAsyncThunk('appAuth/login', async (user: { email: string, password: string }, { rejectWithValue, fulfillWithValue }) => {
  try {
    const { email, password } = user
    const response: any = await axiosClient.post(API_ENDPOINTS.LOGIN, {
      email,
      password
    })
    return fulfillWithValue(response);
  } catch (error: any) {
    return rejectWithValue(error.response.data)
  }
})

export const register = createAsyncThunk('appAuth/register', async (user: any, { rejectWithValue, fulfillWithValue }) => {
  try {
    const { email, password, first_name, last_name } = user
    const response: any = await axiosClient.post(API_ENDPOINTS.REGISTER, {
      email,
      password,
      first_name, 
      last_name
    })
    return fulfillWithValue(response);
  } catch (error: any) {
    return rejectWithValue(error.response.data)
  }
})

export const authSlice = createSlice({
  name: 'auth',
  // `createSlice` will infer the state type from the `initialState` argument
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(login.pending, (state: any) => {
        state.login.loading = true
      })
      .addCase(login.fulfilled, (state: any, action: PayloadAction<any>) => {
        state.login.loading = false
        state.login.data = action.payload
        state.isLogin = true
        state.login.error = false
      })
      .addCase(login.rejected, (state: any, action: PayloadAction<any>) => {
        state.login.loading = false
        state.login.data = action.payload
        state.login.error = true
        state.isLogin = false
      })
      .addCase(register.pending, (state: any) => {
        state.register.loading = true
      })
      .addCase(register.fulfilled, (state: any, action: PayloadAction<any>) => {
        state.register.loading = false
        state.register.data = action.payload
        state.register.error = false
      })
      .addCase(register.rejected, (state: any, action: PayloadAction<any>) => {
        state.register.loading = false
        state.register.data = action.payload
        state.register.error = true
      })
  }
});

export default authSlice.reducer;
