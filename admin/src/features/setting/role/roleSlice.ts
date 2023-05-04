import { createSlice } from '@reduxjs/toolkit';
import { ErrorValidateResponse } from 'src/types';

export interface RoleType {
    code: string
    created_at: string
    description: string
    id: number
    permissions: string[]
    updated_at: string
}

interface RoleState {
    create: {
        result: RoleType | ErrorValidateResponse | null;
        loading: boolean;
        error: boolean;
    },
    list: {
        result: {
            roles: Array<RoleType>
            skip: number
            take: number
            total: number
            totalPage: number
        } | null;
        loading: boolean;
        error: boolean;
    },
    delete: {
        result: RoleType | null;
        loading: boolean;
        error: boolean;
    },
    update: {
        result: RoleType | ErrorValidateResponse | null;
        loading: boolean;
        error: boolean;
    },
    single: {
        result: RoleType | null;
        loading: boolean;
        error: boolean;
    }
}

const initialState: RoleState = {
    create: {
        result: null,
        loading: false,
        error: false
    },
    list: {
        result: null,
        loading: false,
        error: false
    },
    delete: {
        result: null,
        loading: false,
        error: false
    },
    update: {
        result: null,
        loading: false,
        error: false
    },
    single: {
        result: null,
        loading: false,
        error: false
    }
} as RoleState;

export const roleSlice = createSlice({
    name: 'asset',
    initialState,
    reducers: {
        // ** Create role
        createRoleStart: (state) => {
            state.create.loading = true;
        },
        createRoleSuccess: (state, action) => {
            state.create.loading = false;
            state.create.result = action.payload;
            state.create.error = false
        },
        createRoleFailed: (state, action) => {
            state.create.loading = false;
            state.create.result = action.payload;
            state.create.error = true;
        },
        // ** Get roles
        getListRoleStart: (state) => {
            state.list.loading = true;
        },
        getListRoleSuccess: (state, action) => {
            state.list.loading = false;
            state.list.result = action.payload;
            state.list.error = false
        },
        getListRoleFailed: (state) => {
            state.list.loading = false;
            state.list.error = true;
        },
        // ** Delete role
        deleteRoleStart: (state) => {
            state.delete.loading = true;
        },
        deleteRoleSuccess: (state, action) => {
            state.delete.loading = false;
            state.delete.result = action.payload;
            state.delete.error = false
        },
        deleteRoleFailed: (state) => {
            state.delete.loading = false;
            state.delete.error = true;
        },
        // ** Update role
        updateRoleStart: (state) => {
            state.update.loading = true;
        },
        updateRoleSuccess: (state, action) => {
            state.update.loading = false;
            state.update.result = action.payload;
            state.update.error = false
        },
        updateRoleFailed: (state, action) => {
            state.update.loading = false;
            state.update.result = action.payload;
            state.update.error = true;
        },
        // ** Get role
        getRoleStart: (state) => {
            state.single.loading = true;
        },
        getRoleSuccess: (state, action) => {
            state.single.loading = false;
            state.single.result = action.payload;
            state.single.error = false
        },
        getRoleFailed: (state) => {
            state.single.loading = false;
            state.single.error = true;
        },
    },
});

export const {
    createRoleStart,
    createRoleSuccess,
    createRoleFailed,
    getListRoleStart,
    getListRoleSuccess,
    getListRoleFailed,
    deleteRoleStart,
    deleteRoleSuccess,
    deleteRoleFailed,
    getRoleStart,
    getRoleSuccess,
    getRoleFailed,
    updateRoleStart,
    updateRoleSuccess,
    updateRoleFailed
} = roleSlice.actions;

export default roleSlice.reducer;