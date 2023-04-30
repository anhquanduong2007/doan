import { createSlice } from '@reduxjs/toolkit';
import { AuthLoginResponse } from 'src/types';

interface AuthState {
  login: {
    currentUser: AuthLoginResponse | null;
    isFetching: boolean;
    error: boolean;
  },
  logout: {
    isFetching: boolean,
    error: boolean
  }
}

const initialState: AuthState = {
  login: {
    currentUser: null,
    isFetching: false,
    error: false
  },
  logout: {
    isFetching: false,
    error: false
  }
} as AuthState;

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginStart: (state) => {
      state.login.isFetching = true;
    },
    loginSuccess: (state, action) => {
      state.login.isFetching = false;
      state.login.currentUser = action.payload;
      state.login.error = false
    },
    loginFailed: (state) => {
      state.login.isFetching = false;
      state.login.error = true;
    },
    logOutStart: (state) => {
      state.logout.isFetching = true;
    },
    logOutSuccess: (state) => {
      state.logout.isFetching = false;
      state.login.currentUser = null;
      state.logout.error = false
    },
    logOutFailed: (state) => {
      state.logout.isFetching = false;
      state.logout.error = true;
    }
  },
});

export const {
  loginStart,
  loginSuccess,
  loginFailed,
  logOutStart,
  logOutSuccess,
  logOutFailed
} = authSlice.actions;

export default authSlice.reducer;