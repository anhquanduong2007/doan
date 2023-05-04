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
    createRoleSuccess,
    getRoleStart,
    getRoleSuccess,
    getRoleFailed,
    RoleType,
    updateRoleStart,
    updateRoleSuccess,
    updateRoleFailed
} from "./roleSlice";
import { Pagination } from "src/types";
import { IAxiosResponse } from "src/types/axiosResponse";

export type GetListRoleParams = {
    dispatch: AppDispatch,
    axiosClient: Axios,
    pagination: Pagination
}

export type DeleteRoleParams = Omit<GetListRoleParams, "pagination"> & { id: number }

export type CreateRoleParams = Omit<GetListRoleParams, "pagination"> & { role: Role }

export type GetRoleParams = DeleteRoleParams

export type UpdateRoleParams = GetRoleParams & { role: Role }

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
        const res: IAxiosResponse<RoleType> = await axiosClient.delete(`/admin/role/delete/${id}`);
        if (res?.response?.code === 200 && res?.response?.success) {
            setTimeout(function () {
                dispatch(deleteRoleSuccess(res.response.data));
            }, 1000);
        } else if (res?.response?.code === 406 && !res?.response?.success) {
            dispatch(deleteRoleFailed());
            Inotification({
                type: 'error',
                message: res?.response?.message || 'Something went wrong!'
            })
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
        } else {
            dispatch(createRoleFailed({
                fieldError: res.response.fieldError,
                message: res.response.message
            }));
        }
    } catch (error) {
        dispatch(createRoleFailed(null));
        Inotification({
            type: 'error',
            message: 'Something went wrong!'
        })
    }
}

export const getSingleRole = async ({ axiosClient, dispatch, id }: GetRoleParams) => {
    dispatch(getRoleStart());
    try {
        const res: IAxiosResponse<RoleType> = await axiosClient.get(`admin/role/single/${id}`);
        if (res?.response?.code === 200 && res?.response?.success) {
            setTimeout(function () {
                dispatch(getRoleSuccess(res.response.data));
            }, 1000);
        }
    } catch (error) {
        dispatch(getRoleFailed());
        Inotification({
            type: 'error',
            message: 'Something went wrong!'
        })
    }
}

export const updateRole = async ({ axiosClient, dispatch, id, role }: UpdateRoleParams) => {
    const { code, permissions, description } = role
    dispatch(updateRoleStart());
    try {
        const res: IAxiosResponse<RoleType> = await axiosClient.put(`admin/role/update/${id}`, {
            code,
            permissions,
            description
        });
        if (res?.response?.code === 200 && res?.response?.success) {
            setTimeout(function () {
                dispatch(updateRoleSuccess(res.response.data));
            }, 1000);
        } else {
            dispatch(updateRoleFailed({
                fieldError: res.response.fieldError,
                message: res.response.message
            }));
        }
    } catch (error) {
        dispatch(updateRoleFailed(null));
        Inotification({
            type: 'error',
            message: 'Something went wrong!'
        })
    }
}