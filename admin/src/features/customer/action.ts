import { AppDispatch } from "src/app/store";
import {
    getListCustomerStart,
    getListCustomerSuccess,
    getListCustomerFailed,
    deleteCustomerStart,
    deleteCustomerSuccess,
    deleteCustomerFailed,
    getCustomerStart,
    getCustomerSuccess,
    getCustomerFailed,
    createCustomerStart,
    createCustomerSuccess,
    createCustomerFailed,
    updateCustomerStart,
    updateCustomerSuccess,
    updateCustomerFailed
} from "./customerSlice";
import { Inotification } from 'src/common';
import { AxiosInstance } from "axios";
import { Pagination } from "src/types";
import { IAxiosResponse } from "src/types/axiosResponse";
import { User } from "src/types/user";
import { NavigateFunction } from "react-router-dom";
import { MessageApi } from "antd/lib/message";
import { UseFormSetError } from "react-hook-form";
import { FormValuesCustomer } from "src/components/Customers/create-update";

type CreateCustomerParams = Omit<GetListCustomerParams, "pagination"> & {
    customer: CustomerCreate,
    setError: UseFormSetError<FormValuesCustomer>,
    message: MessageApi
}

interface CustomerCreate {
    password: string
    first_name: string
    last_name: string
    gender: number
    date_of_birth?: string
    email: string
    phone?: string
    active: number
}

interface UpdateCustomerParams {
    id: number
    customer: Omit<CustomerCreate, "password">,
    setError: UseFormSetError<Omit<FormValuesCustomer, "password">>,
    message: MessageApi
    dispatch: AppDispatch,
    axiosClientJwt: AxiosInstance,
    navigate: NavigateFunction
}

interface GetListCustomerParams {
    dispatch: AppDispatch,
    axiosClientJwt: AxiosInstance,
    pagination: Pagination,
    navigate: NavigateFunction
}

export type DeleteCustomerParams = Omit<GetListCustomerParams, "pagination">
    & {
        id: number,
        setIsModalOpen: (open: boolean) => void,
        setRefresh: (refresh: boolean) => void,
        refresh: boolean,
        message: MessageApi
    }

export type GetCustomerParams = Omit<GetListCustomerParams, "pagination"> & { id: number }

export const getListCustomer = async ({ pagination, dispatch, axiosClientJwt, navigate }: GetListCustomerParams) => {
    try {
        const { skip, take } = pagination;
        const accessToken = localStorage.getItem("accessToken")
        dispatch(getListCustomerStart());
        const res: IAxiosResponse<User> = await axiosClientJwt.get('/user/customers', {
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
                dispatch(getListCustomerSuccess(res.response.data));
            }, 1000)
        } else {
            dispatch(getListCustomerFailed(null));
        }
    } catch (error: any) {
        dispatch(getListCustomerFailed(null));
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

export const deleteCustomer = async ({ id, dispatch, axiosClientJwt, navigate, message, refresh, setIsModalOpen, setRefresh }: DeleteCustomerParams) => {
    try {
        dispatch(deleteCustomerStart());
        const accessToken = localStorage.getItem("accessToken")
        const res: IAxiosResponse<User> = await axiosClientJwt.delete(`/user/delete/${id}`, {
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        });
        if (res?.response?.code === 200 && res?.response?.success) {
            setTimeout(function () {
                dispatch(deleteCustomerSuccess(res.response.data))
                message.success('Delete customer successfully!')
                setIsModalOpen(false)
                setRefresh(!refresh)
            }, 1000);
        } else {
            dispatch(deleteCustomerFailed(null));
            setTimeout(function () {
                setIsModalOpen(false)
            }, 1000)

        }
    } catch (error: any) {
        dispatch(deleteCustomerFailed(null));
        if (error?.response?.status === 403 && error?.response?.statusText === "Forbidden") {
            Inotification({
                type: 'error',
                message: 'You do not have permission to perform this action!'
            })
            setTimeout(function () {
                setIsModalOpen(false)
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

export const createCustomer = async ({ customer, axiosClientJwt, dispatch, navigate, setError, message }: CreateCustomerParams) => {
    try {
        const { active, email, first_name, last_name, date_of_birth, gender, phone, password } = customer;
        const accessToken = localStorage.getItem("accessToken")
        dispatch(createCustomerStart());
        const res: IAxiosResponse<User> = await axiosClientJwt.post('/auth/customer/register', {
            active,
            email,
            first_name,
            last_name,
            date_of_birth,
            gender,
            phone,
            password
        }, {
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        });
        if (res?.response?.code === 200 && res?.response?.success) {
            setTimeout(function () {
                dispatch(createCustomerSuccess(res.response.data));
                message.success('Create customer successfully!');
                navigate("/customers")
            }, 1000)
        } else if (res?.response?.code === 400 && !res?.response?.success) {
            dispatch(createCustomerFailed(null));
            setError(res?.response?.fieldError as keyof FormValuesCustomer, { message: res?.response?.message })
        } else {
            dispatch(createCustomerFailed(null));
        }
    } catch (error: any) {
        dispatch(createCustomerFailed(null));
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

export const getCustomer = async ({ id, dispatch, axiosClientJwt, navigate }: GetCustomerParams) => {
    try {
        const accessToken = localStorage.getItem("accessToken")
        dispatch(getCustomerStart());
        const res: IAxiosResponse<User> = await axiosClientJwt.get(`/user/customer/${id}`, {
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        });
        if (res?.response?.code === 200 && res?.response?.success) {
            setTimeout(function () {
                dispatch(getCustomerSuccess(res.response.data));
            }, 1000)
        } else {
            dispatch(getCustomerFailed(null));
        }
    } catch (error: any) {
        dispatch(getCustomerFailed(null));
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

export const updateCustomer = async ({ customer, axiosClientJwt, dispatch, navigate, setError, message, id }: UpdateCustomerParams) => {
    try {
        const { active, email, first_name, last_name, date_of_birth, gender, phone } = customer;
        const accessToken = localStorage.getItem("accessToken")
        dispatch(updateCustomerStart());
        const [res]: [IAxiosResponse<User>] = await Promise.all([
            await axiosClientJwt.put(`/user/customer/update/${id}`, {
                active,
                email,
                first_name,
                last_name,
                date_of_birth,
                gender,
                phone,
            }, {
                headers: {
                    Authorization: `Bearer ${accessToken}`
                }
            }),
        ])
        if (res?.response?.code === 200 && res?.response?.success) {
            setTimeout(function () {
                dispatch(updateCustomerSuccess(res.response.data));
                message.success('Update customer successfully!');
                navigate("/customers")
            }, 1000)
        } else if (res?.response?.code === 400 && !res?.response?.success) {
            dispatch(updateCustomerFailed(null));
            setError(res?.response?.fieldError as keyof Omit<FormValuesCustomer, "password">, { message: res?.response?.message })
        } else {
            dispatch(updateCustomerFailed(null));
        }
    } catch (error: any) {
        dispatch(updateCustomerFailed(null));
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


