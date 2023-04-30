import { AppDispatch } from "src/app/store";
import { Inotification } from 'src/common';
import type { Axios } from "axios";
import {
    getListRoleFailed,
    getListRoleStart,
    getListRoleSuccess,
    deleteRoleFailed,
    deleteRoleStart,
    deleteRoleSuccess,
    createRoleFailed,
    createRoleStart,
    createRoleSuccess
} from "./roleSlice";

export type GetListRoleParams = {
    dispatch: AppDispatch,
    axiosClient: Axios,
    pagination: {
        take: number,
        skip: number
    }
}

export type DeleteRoleParams = Omit<GetListRoleParams, "pagination"> & { id: number }

export type CreateRoleParams = Omit<GetListRoleParams, "pagination"> & { role: Role }

export type Role = {
    code: string
    description?: string
    permissions: string[]
}

export const getListRole = async ({ pagination, dispatch, axiosClient }: GetListRoleParams) => {
    const { skip, take } = pagination;
    dispatch(getListRoleStart());
    try {
        const res: any = await axiosClient.get('/admin/role/list', {
            params: {
                take,
                skip,
            }
        });
        if (res?.response?.code === 200 && res?.response?.success) {
            setTimeout(function () {
                dispatch(getListRoleSuccess(res.response.data));
            }, 1000);
        }
    } catch (error) {
        dispatch(getListRoleFailed());
        Inotification({
            type: 'error',
            message: 'Something went wrong!'
        })
    }
}

export const deleteRole = async ({ id, dispatch, axiosClient }: DeleteRoleParams) => {
    dispatch(deleteRoleStart());
    try {
        const res: any = await axiosClient.delete(`/admin/role/delete/${id}`);
        if (res?.response?.code === 200 && res?.response?.success) {
            setTimeout(function () {
                dispatch(deleteRoleSuccess(res.response.data));
            }, 1000);
        }
    } catch (error) {
        dispatch(deleteRoleFailed());
        Inotification({
            type: 'error',
            message: 'Something went wrong!'
        })
    }
}

export const createRole = async ({ role, dispatch, axiosClient }: CreateRoleParams) => {
    const { code, permissions, description } = role
    dispatch(createRoleStart());
    try {
        const res: any = await axiosClient.post(`/admin/role/create`, {
            code,
            permissions,
            description
        });
        if (res?.response?.code === 200 && res?.response?.success) {
            setTimeout(function () {
                dispatch(createRoleSuccess(res.response.data));
            }, 1000);
        }
    } catch (error) {
        dispatch(createRoleFailed());
        Inotification({
            type: 'error',
            message: 'Something went wrong!'
        })
    }
}