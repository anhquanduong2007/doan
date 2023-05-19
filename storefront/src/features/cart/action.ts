import { AppDispatch } from "src/app/store";
import {
    addToCartStart,
    addToCartSuccess,
    addToCartFailed,
    getListProductOnCartStart,
    getListProductOnCartSuccess,
    getListProductOnCartFailed
} from "./cartSlice";
import type { AxiosInstance } from "axios";
import { IAxiosResponse } from "src/types/axiosResponse";
import { CreateToastFnReturn } from "@chakra-ui/react";

export type AddToCartParams = {
    dispatch: AppDispatch,
    axiosClientJwt: AxiosInstance,
    cart: {
        quantity: number
    },
    id: number,
    toast: CreateToastFnReturn
}

export type GetListProductOnCartParams = Omit<AddToCartParams, "cart" | "id">

export const addToCart = async ({ axiosClientJwt, cart, dispatch, id, toast }: AddToCartParams) => {
    try {
        const { quantity } = cart
        const accessToken = localStorage.getItem("accessToken")
        if (accessToken) {
            dispatch(addToCartStart());
            const res: IAxiosResponse<{}> = await axiosClientJwt.post(`product/cart/${id}`, {
                quantity
            }, {
                headers: {
                    Authorization: `Bearer ${accessToken}`
                }
            });
            if (res?.response?.code === 200 && res?.response?.success) {
                setTimeout(function () {
                    dispatch(addToCartSuccess(res.response.data));
                    toast({
                        status: 'success',
                        title: "Added in card!",
                        isClosable: true,
                        position: "top-right"
                    })
                }, 1000);
            } else if (res?.response?.code === 400 && !res?.response?.success) {
                dispatch(addToCartFailed(null));
                toast({
                    status: 'warning',
                    title: res?.response?.message,
                    isClosable: true,
                    position: "top-right"
                })
            } else {
                dispatch(addToCartFailed(null));
            }
        } else {
            toast({
                status: 'error',
                title: "You need to login to perform this action!",
                isClosable: true,
                position: "top-right"
            })
        }
    } catch (error: any) {
        dispatch(addToCartFailed(null));
        toast({
            status: 'error',
            title: "Something went wrong!",
            isClosable: true,
        })
    }
}

export const getListProductOnCart = async ({ axiosClientJwt, dispatch, toast }: GetListProductOnCartParams) => {
    try {
        const accessToken = localStorage.getItem("accessToken")
        dispatch(getListProductOnCartStart());
        const res: IAxiosResponse<{}> = await axiosClientJwt.get(`product/cart`, {
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        });
        if (res?.response?.code === 200 && res?.response?.success) {
            setTimeout(function () {
                dispatch(getListProductOnCartSuccess(res.response.data));
            }, 1000);
        } else {
            dispatch(getListProductOnCartFailed(null));
        }
    } catch (error: any) {
        dispatch(getListProductOnCartFailed(null));
        toast({
            status: 'error',
            title: "Something went wrong!",
            isClosable: true,
        })
    }
}