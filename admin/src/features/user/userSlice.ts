import { createSlice } from '@reduxjs/toolkit';
import { AuthLoginResponse } from 'src/types';
import type { RootState } from '../../app/store';

// Define a type for the slice state
interface UserState {
    allUsers: any;
    isFetching: boolean;
    error: boolean;

}

const initialState: UserState = {
    allUsers: null,
    isFetching: false,
    error: false
} as UserState;

export const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        getAllUsersStart: (state) => {
            state.isFetching = true;
        },
        getAllUsersSuccess: (state, action) => {
            state.isFetching = false;
            state.allUsers = action.payload;
            state.error = false
        },
        getAllUsersFailed: (state) => {
            state.isFetching = false;
            state.error = true;
        }
    },
});

export const { getAllUsersStart, getAllUsersSuccess, getAllUsersFailed } = userSlice.actions;

export default userSlice.reducer;