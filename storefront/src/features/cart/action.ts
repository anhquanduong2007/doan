import { AppDispatch } from "src/app/store";
import {
    addToCartStart,
    addToCartSuccess,
    addToCartFailed,
} from "./cartSlice";
import type { AxiosInstance } from "axios";
import { User } from "src/types/user";
import { IAxiosResponse } from "src/types/axiosResponse";
import { NavigateFunction } from "react-router-dom";
import { CreateToastFnReturn } from "@chakra-ui/react";

export type AddToCartParams = {
    dispatch: AppDispatch,
    axiosClientJwt: AxiosInstance,
    navigate: NavigateFunction
    cart: {
        quantity: number
    },
    id: number,
    toast: CreateToastFnReturn
}

export const addToCart = async ({ axiosClientJwt, cart, dispatch, navigate, id, toast }: AddToCartParams) => {
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