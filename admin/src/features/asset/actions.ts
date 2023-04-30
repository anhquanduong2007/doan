import { AppDispatch } from "src/app/store";
import {
    getListAssetStart,
    getListAssetSuccess,
    getListAssetFailed,
    deleteAssetStart,
    deleteAssetSuccess,
    deleteAssetFailed
} from "./assetSlice";
import { Inotification } from 'src/common';
import type { Axios } from "axios";

interface GetListAssetParams {
    dispatch: AppDispatch,
    navigate: Function,
    axiosClient: Axios,
    pagination: {
        take: number,
        skip: number
        search?: string
    }
}

interface GetAssetParams {
    dispatch: AppDispatch,
    navigate: Function,
    axiosClient: Axios,
    assetId: string
}

interface DeleteAsset {
    assetId: string,
    dispatch: AppDispatch,
    navigate: Function,
    axiosClient: Axios,
}

export const getListAsset = async ({ pagination, dispatch, navigate, axiosClient }: GetListAssetParams) => {
    const { skip, take, search } = pagination;
    dispatch(getListAssetStart());
    try {
        const res: any = await axiosClient.get('asset/list', {
            params: {
                take,
                skip,
                search
            }
        });
        if (res?.response?.code === 200 && res?.response?.success) {
            setTimeout(function () {
                dispatch(getListAssetSuccess(res.response.data));
                navigate('/assets');
            }, 1000);
        }
        // setTimeout(function () {
        //     dispatch(getListAssetFailed());
        //     setError("password", {
        //         type: "checkUser",
        //         message: res?.response?.message
        //     });
        // }, 1000)
    } catch (error) {
        dispatch(getListAssetFailed());
        Inotification({
            type: 'error',
            message: 'Something went wrong!'
        })
    }
}

export const deleteAsset = async ({ assetId, dispatch, navigate, axiosClient }: DeleteAsset) => {
    dispatch(deleteAssetStart());
    try {
        const res: any = await axiosClient.delete(`asset/delete/${assetId}`);
        if (res?.response?.code === 200 && res?.response?.success) {
            setTimeout(function () {
                dispatch(deleteAssetSuccess(res.response.data));
            }, 1000);
        }
        // setTimeout(function () {
        //     dispatch(getListAssetFailed());
        //     Inotification({
        //         type: 'error',
        //         message: 'Something went wrong!'
        //     })
        // }, 1000)
    } catch (error) {
        dispatch(deleteAssetFailed());
        Inotification({
            type: 'error',
            message: 'Something went wrong!'
        })
    }
}

// export const getAsset = async ({ assetId, dispatch, navigate, axiosClient }: GetAssetParams) => {
//     dispatch(getListAssetStart());
//     try {
//         const res: any = await axiosClient.get('asset/list', {
//             params: {
//                 take,
//                 skip,
//                 search
//             }
//         });
//         if (res?.response?.code === 200 && res?.response?.success) {
//             setTimeout(function () {
//                 dispatch(getListAssetSuccess(res.response.data));
//             }, 1000);
//         }
//         // setTimeout(function () {
//         //     dispatch(getListAssetFailed());
//         //     setError("password", {
//         //         type: "checkUser",
//         //         message: res?.response?.message
//         //     });
//         // }, 1000)
//     } catch (error) {
//         dispatch(getListAssetFailed());
//         Inotification({
//             type: 'error',
//             message: 'Something went wrong!'
//         })
//     }
// }