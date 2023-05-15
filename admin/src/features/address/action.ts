import { AppDispatch } from "src/app/store";
import {
    deleteAddressStart,
    deleteAddressSuccess,
    deleteAddressFailed,
    createAddressStart,
    createAddressSuccess,
    createAddressFailed,
    updateAddressStart,
    updateAddressSuccess,
    updateAddressFailed,
    getAddressStart,
    getAddressSuccess,
    getAddressFailed,
    setDefaultShippingAddressStart,
    setDefaultShippingSuccess,
    setDefaultShippingFailed
} from "./addressSlice";
import { Inotification } from 'src/common';
import { AxiosInstance } from "axios";
import { IAxiosResponse } from "src/types/axiosResponse";
import { UserAddress } from "src/types/user";
import { NavigateFunction } from "react-router-dom";
import { MessageApi } from "antd/lib/message";

export type DeleteAddressParams = {
    dispatch: AppDispatch,
    axiosClientJwt: AxiosInstance,
    navigate: NavigateFunction
    id: number,
    setIsModalOpen: (open: boolean) => void,
    setRefresh: (refresh: boolean) => void,
    refresh: boolean,
    message: MessageApi
}

export interface CreateAddressParams extends Omit<DeleteAddressParams, "id"> {
    address: AddressCreate
}

export interface GetAddressParams extends Omit<DeleteAddressParams, "setIsModalOpen" | "setRefresh" | "refresh" | "message"> { }

interface AddressCreate {
    street_line_1: string
    street_line_2: string
    country: string
    city: string
    postal_code: string
    province: string
    customer_id: number
}

interface UpdateAddressParams extends CreateAddressParams {
    id: number
}

interface SetDefaultShippingAddressParams {
    id: number
    customer_id: number
    dispatch: AppDispatch,
    axiosClientJwt: AxiosInstance,
    navigate: NavigateFunction
    message: MessageApi,
    setRefresh: (refresh: boolean) => void,
    refresh: boolean,
}


export const deleteAddress = async ({ id, dispatch, axiosClientJwt, navigate, message, refresh, setIsModalOpen, setRefresh }: DeleteAddressParams) => {
    try {
        dispatch(deleteAddressStart());
        const accessToken = localStorage.getItem("accessToken")
        const res: IAxiosResponse<UserAddress> = await axiosClientJwt.delete(`/address/delete/${id}`, {
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        });
        if (res?.response?.code === 200 && res?.response?.success) {
            setTimeout(function () {
                dispatch(deleteAddressSuccess(res.response.data))
                message.success('Delete address successfully!')
                setIsModalOpen(false)
                setRefresh(!refresh)
            }, 1000);
        } else {
            dispatch(deleteAddressFailed(null));
            setTimeout(function () {
                setIsModalOpen(false)
            }, 1000)

        }
    } catch (error: any) {
        dispatch(deleteAddressFailed(null));
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

export const createAddress = async ({ address, axiosClientJwt, dispatch, navigate, message, refresh, setIsModalOpen, setRefresh }: CreateAddressParams) => {
    try {
        const { city, country, customer_id, postal_code, province, street_line_1, street_line_2 } = address;
        const accessToken = localStorage.getItem("accessToken")
        dispatch(createAddressStart());
        const res: IAxiosResponse<UserAddress> = await axiosClientJwt.post('/address/create', {
            city,
            country,
            customer_id,
            postal_code,
            province,
            street_line_1,
            street_line_2
        }, {
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        });
        if (res?.response?.code === 200 && res?.response?.success) {
            setTimeout(function () {
                dispatch(createAddressSuccess(res.response.data));
                message.success('Create address successfully!');
                setIsModalOpen(false)
                setRefresh(!refresh)
            }, 1000)
        } else {
            dispatch(createAddressFailed(null));
            setTimeout(function () {
                setIsModalOpen(false)
            }, 1000)
        }
    } catch (error: any) {
        dispatch(createAddressFailed(null));
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

export const getAddress = async ({ id, dispatch, axiosClientJwt, navigate }: GetAddressParams) => {
    try {
        const accessToken = localStorage.getItem("accessToken")
        dispatch(getAddressStart());
        const res: IAxiosResponse<UserAddress> = await axiosClientJwt.get(`/address/${id}`, {
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        });
        if (res?.response?.code === 200 && res?.response?.success) {
            setTimeout(function () {
                dispatch(getAddressSuccess(res.response.data));
            }, 1000)
        } else {
            dispatch(getAddressFailed(null));
        }
    } catch (error: any) {
        dispatch(getAddressFailed(null));
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

export const updateAddress = async ({ address, axiosClientJwt, dispatch, navigate, message, id, refresh, setIsModalOpen, setRefresh }: UpdateAddressParams) => {
    try {
        const { city, country, customer_id, postal_code, province, street_line_1, street_line_2 } = address;
        const accessToken = localStorage.getItem("accessToken")
        dispatch(updateAddressStart());
        const [res]: [IAxiosResponse<UserAddress>] = await Promise.all([
            await axiosClientJwt.put(`/address/update/${id}`, {
                city,
                country,
                customer_id,
                postal_code,
                province,
                street_line_1,
                street_line_2
            }, {
                headers: {
                    Authorization: `Bearer ${accessToken}`
                }
            }),
        ])
        if (res?.response?.code === 200 && res?.response?.success) {
            setTimeout(function () {
                dispatch(updateAddressSuccess(res.response.data));
                message.success('Update address successfully!');
                setIsModalOpen(false)
                setRefresh(!refresh)
            }, 1000)
        } else {
            dispatch(updateAddressFailed(null));
            setTimeout(function () {
                setIsModalOpen(false)
            }, 1000)
        }
    } catch (error: any) {
        dispatch(updateAddressFailed(null));
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

export const setDefaultShippingAddressAction = async ({ customer_id, axiosClientJwt, dispatch, navigate, message, id, refresh, setRefresh }: SetDefaultShippingAddressParams) => {
    try {
        const accessToken = localStorage.getItem("accessToken")
        dispatch(setDefaultShippingAddressStart());
        const [res]: [IAxiosResponse<UserAddress>] = await Promise.all([
            await axiosClientJwt.put(`/address/default-shipping-address/${id}`, {
                customer_id,
            }, {
                headers: {
                    Authorization: `Bearer ${accessToken}`
                }
            }),
        ])
        if (res?.response?.code === 200 && res?.response?.success) {
            setTimeout(function () {
                dispatch(setDefaultShippingSuccess(res.response.data));
                message.success('Set default shipping address successfully!');
                setRefresh(!refresh)
            }, 1000)
        } else {
            dispatch(setDefaultShippingFailed(null));
        }
    } catch (error: any) {
        dispatch(setDefaultShippingFailed(null));
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

