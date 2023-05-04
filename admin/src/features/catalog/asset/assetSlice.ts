import { createSlice } from '@reduxjs/toolkit';

export interface AssetType {
    cloudinary_asset_id: string
    cloudinary_public_id: string
    created_at: string
    format: string
    height: number
    id: number
    name: string
    updated_at: string
    url: string
    width: number
}


interface AssetState {
    list: {
        result: {
            assets: Array<AssetType>
            skip: number
            take: number
            total: number
            totalPage: number
        } | null;
        loading: boolean;
        error: boolean;
    }
    update: {
        result: any;
        loading: boolean;
        error: boolean;
    }
    single: {
        result: any;
        loading: boolean;
        error: boolean;
    }
    delete: {
        result: any;
        loading: boolean;
        error: boolean;
    }
}

const initialState: AssetState = {
    list: {
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
    },
    delete: {
        result: null,
        loading: false,
        error: false
    },
} as AssetState;

export const assetSlice = createSlice({
    name: 'asset',
    initialState,
    reducers: {
        // ** Get list asset
        getListAssetStart: (state) => {
            state.list.loading = true;
        },
        getListAssetSuccess: (state, action) => {
            state.list.loading = false;
            state.list.result = action.payload;
            state.list.error = false
        },
        getListAssetFailed: (state) => {
            state.list.loading = false;
            state.list.error = true;
        },
        // ** Get asset
        getAssetStart: (state) => {
            state.single.loading = true;
        },
        getAssetSuccess: (state, action) => {
            state.single.loading = false;
            state.single.result = action.payload;
            state.single.error = false
        },
        getAssetFailed: (state) => {
            state.single.loading = false;
            state.single.error = true;
        },
        // ** Delete asset
        deleteAssetStart: (state) => {
            state.delete.loading = true
        },
        deleteAssetSuccess: (state, action) => {
            state.delete.loading = false;
            state.delete.result = action.payload;
            state.delete.error = false
        },
        deleteAssetFailed: (state) => {
            state.delete.loading = false;
            state.delete.error = true;
        },
        // ** Update asset
        updateAssetStart: (state) => {
            state.update.loading = true
        },
        updateAssetSuccess: (state, action) => {
            state.update.loading = false;
            state.update.result = action.payload;
            state.update.error = false
        },
        updateAssetFailed: (state) => {
            state.update.loading = false;
            state.update.error = true;
        },
    },
});

export const {
    getListAssetStart,
    getListAssetSuccess,
    getListAssetFailed,
    deleteAssetStart,
    deleteAssetSuccess,
    deleteAssetFailed,
    getAssetStart,
    getAssetSuccess,
    getAssetFailed,
    updateAssetStart,
    updateAssetSuccess,
    updateAssetFailed
} = assetSlice.actions;

export default assetSlice.reducer;