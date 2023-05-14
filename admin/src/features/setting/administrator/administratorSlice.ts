import { createSlice } from '@reduxjs/toolkit';
import { User } from 'src/types/user';



interface AdministratorState {
    list: {
        result: {
            administrators: Array<User>
            skip: number
            take: number
            total: number
            totalPage: number
        } | null;
        loading: boolean;
        error: boolean;
    },
    // delete: {
    //     result: RoleType | null;
    //     loading: boolean;
    //     error: boolean;
    // },
    // update: {
    //     result: RoleType | ErrorValidateResponse | null;
    //     loading: boolean;
    //     error: boolean;
    // },
    // single: {
    //     result: RoleType | null;
    //     loading: boolean;
    //     error: boolean;
    // }
}

const initialState: AdministratorState = {
    // create: {
    //     result: null,
    //     loading: false,
    //     error: false
    // },
    list: {
        result: null,
        loading: false,
        error: false
    },
    // delete: {
    //     result: null,
    //     loading: false,
    //     error: false
    // },
    // update: {
    //     result: null,
    //     loading: false,
    //     error: false
    // },
    // single: {
    //     result: null,
    //     loading: false,
    //     error: false
    // }
} as AdministratorState;

export const administratorSlice = createSlice({
    name: 'administrator',
    initialState,
    reducers: {
        // ** Get administrators
        getListAdministratorStart: (state) => {
            state.list.loading = true;
        },
        getListAdministratorSuccess: (state, action) => {
            state.list.loading = false;
            state.list.result = action.payload;
            state.list.error = false
        },
        getListAdministratorFailed: (state, action) => {
            state.list.loading = false;
            state.list.result = action.payload;
            state.list.error = true;
        },
    },
});

export const {
    getListAdministratorStart,
    getListAdministratorSuccess,
    getListAdministratorFailed
} = administratorSlice.actions;

export default administratorSlice.reducer;