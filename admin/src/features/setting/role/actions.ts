import { AppDispatch } from "src/app/store";
import { Inotification } from 'src/common';
import type { AxiosInstance } from "axios";
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
    updateRoleStart,
    updateRoleSuccess,
    updateRoleFailed
} from "./roleSlice";
import { Pagination, Role } from "src/types";
import { IAxiosResponse } from "src/types/axiosResponse";
import { NavigateFunction } from "react-router-dom";
import { MessageApi } from "antd/lib/message";
import { UseFormSetError } from "react-hook-form";
import { FormValuesRole } from "src/components/Settings/Roles/create-update";

type CreateRoleParams = Omit<GetListRoleParams, "pagination"> & {
    role: RoleCreate,
    setError: UseFormSetError<FormValuesRole>,
    message: MessageApi
}

export type RoleCreate = {
    role_code: string
    role_name: string
    description?: string
    permissions: string[]
}

interface GetListRoleParams {
    dispatch: AppDispatch,
    axiosClientJwt: AxiosInstance,
    pagination: Pagination,
    navigate: NavigateFunction
}

export type DeleteRoleParams = Omit<GetListRoleParams, "pagination">
    & {
        id: number,
        setIsModalOpen: (open: boolean) => void,
        setRefresh: (refresh: boolean) => void,
        refresh: boolean,
        message: MessageApi
    }

export type GetRoleParams = Omit<GetListRoleParams, "pagination"> & { id: number }


interface UpdateRoleParams extends CreateRoleParams {
    id: number
}

export const getListRole = async ({ pagination, dispatch, axiosClientJwt, navigate }: GetListRoleParams) => {
    try {
        const { skip, take } = pagination;
        const accessToken = localStorage.getItem("accessToken")
        dispatch(getListRoleStart());
        const res: IAxiosResponse<Role> = await axiosClientJwt.get('/role', {
            params: {
                take,
                skip,
            },
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        });
        if (res?.response?.code === 200 && res?.response?.success) {
            setTimeout(function () {
                dispatch(getListRoleSuccess(res.response.data));
            }, 1000);
        }
    } catch (error: any) {
        dispatch(getListRoleFailed(null));
        if (error?.response?.status === 403 && error?.response?.statusText === "Forbidden") {
            Inotification({
                type: 'error',
                message: 'You do not have permission to perform this action!'
            })
            setTimeout(function () {
                navigate('/')
            }, 1000);
        } else {
            Inotification({
                type: 'error',
                message: 'Something went wrong!'
            })
        }
    }
}

export const deleteRole = async ({ id, dispatch, axiosClientJwt, navigate, message, refresh, setIsModalOpen, setRefresh }: DeleteRoleParams) => {
    try {
        dispatch(deleteRoleStart());
        const accessToken = localStorage.getItem("accessToken")
        const res: IAxiosResponse<Role> = await axiosClientJwt.delete(`/role/delete/${id}`, {
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        });
        if (res?.response?.code === 200 && res?.response?.success) {
            setTimeout(function () {
                dispatch(deleteRoleSuccess(res.response.data));
                message.success('Delete role successfully!')
                setIsModalOpen(false)
                setRefresh(!refresh)
            }, 1000);
        } else if (res?.response?.code === 404 && !res?.response?.success) {
            dispatch(deleteRoleFailed(null));
            Inotification({
                type: 'error',
                message: res?.response?.message || 'Something went wrong!'
            })
            setTimeout(function () {
                setIsModalOpen(false)
            }, 1000)
        } else {
            dispatch(deleteRoleFailed(null));
            Inotification({
                type: 'error',
                message: 'Something went wrong!'
            })
            setTimeout(function () {
                setIsModalOpen(false)
            }, 1000)
        }
    } catch (error: any) {
        dispatch(deleteRoleFailed(null));
        if (error?.response?.status === 403 && error?.response?.statusText === "Forbidden") {
            Inotification({
                type: 'error',
                message: 'You do not have permission to perform this action!'
            })
            setTimeout(function () {
                navigate('/')
            }, 1000);
        } else {
            Inotification({
                type: 'error',
                message: 'Something went wrong!'
            })
        }
    }
}

export const createRole = async ({ role, dispatch, axiosClientJwt, navigate, message, setError }: CreateRoleParams) => {
    try {
        const { role_code, role_name, permissions, description } = role
        dispatch(createRoleStart());
        const accessToken = localStorage.getItem("accessToken")
        const res: any = await axiosClientJwt.post(`/role/create`, {
            role_code,
            role_name,
            permissions,
            description
        }, {
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        });
        if (res?.response?.code === 200 && res?.response?.success) {
            setTimeout(function () {
                dispatch(createRoleSuccess(res.response.data));
                message.success('Create role successfully!');
                navigate("/settings/roles")
            }, 1000);
        } else if (res?.response?.code === 400 && !res?.response?.success) {
            dispatch(createRoleFailed(null));
            setError(res?.response?.fieldError as keyof FormValuesRole, { message: res?.response?.message })
        } else {
            dispatch(createRoleFailed(null));
        }
    } catch (error: any) {
        dispatch(createRoleFailed(null));
        if (error?.response?.status === 403 && error?.response?.statusText === "Forbidden") {
            Inotification({
                type: 'error',
                message: 'You do not have permission to perform this action!'
            })
            setTimeout(function () {
                navigate('/')
            }, 1000);
        } else {
            Inotification({
                type: 'error',
                message: 'Something went wrong!'
            })
        }
    }
}

export const getSingleRole = async ({ axiosClientJwt, dispatch, id, navigate }: GetRoleParams) => {
    try {
        dispatch(getRoleStart());
        const accessToken = localStorage.getItem("accessToken")
        const res: IAxiosResponse<Role> = await axiosClientJwt.get(`/role/${id}`, {
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        });
        if (res?.response?.code === 200 && res?.response?.success) {
            setTimeout(function () {
                dispatch(getRoleSuccess(res.response.data));
            }, 1000);
        } else {
            dispatch(getRoleFailed(null));
        }
    } catch (error: any) {
        dispatch(getRoleFailed(null));
        if (error?.response?.status === 403 && error?.response?.statusText === "Forbidden") {
            Inotification({
                type: 'error',
                message: 'You do not have permission to perform this action!'
            })
            setTimeout(function () {
                navigate('/')
            }, 1000);
        } else {
            Inotification({
                type: 'error',
                message: 'Something went wrong!'
            })
        }
    }
}

export const updateRole = async ({ axiosClientJwt, dispatch, id, role, message, navigate, setError }: UpdateRoleParams) => {
    try {
        dispatch(updateRoleStart());
        const { role_code, permissions, description, role_name } = role
        const accessToken = localStorage.getItem("accessToken")
        const res: IAxiosResponse<Role> = await axiosClientJwt.put(`/role/update/${id}`, {
            role_code,
            role_name,
            permissions,
            description
        }, {
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        });
        if (res?.response?.code === 200 && res?.response?.success) {
            setTimeout(function () {
                dispatch(updateRoleSuccess(res.response.data));
                message.success('Update role successfully!');
                navigate("/settings/roles")
            }, 1000);
        } else if (res?.response?.code === 400 && !res?.response?.success) {
            dispatch(updateRoleFailed(null));
            setError(res?.response?.fieldError as keyof FormValuesRole, { message: res?.response?.message })
        } else {
            dispatch(updateRoleFailed(null));
        }
    } catch (error: any) {
        dispatch(updateRoleFailed(null));
        if (error?.response?.status === 403 && error?.response?.statusText === "Forbidden") {
            Inotification({
                type: 'error',
                message: 'You do not have permission to perform this action!'
            })
            setTimeout(function () {
                navigate('/')
            }, 1000);
        } else {
            Inotification({
                type: 'error',
                message: 'Something went wrong!'
            })
        }
    }
}