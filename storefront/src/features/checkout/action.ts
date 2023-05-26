import {
    checkPromotionFailed,
    checkPromotionStart,
    checkPromotionSuccess,
    resetPromotion,
    createOrderStart,
    createOrderSuccess,
    createOrderFailed
} from './checkoutSlice'
import { CreateToastFnReturn } from "@chakra-ui/react";
import { Axios, AxiosInstance } from "axios";
import { AppDispatch } from "src/app/store";
import { PaymentMethod } from 'src/pages/CheckoutPage';
import { IAxiosResponse } from 'src/shared/types';

interface CheckPromotionParams {
    dispatch: AppDispatch,
    setError: Function,
    axiosClient: Axios
    toast: CreateToastFnReturn,
    setRefresh: (refresh: boolean) => void,
    refresh: boolean,
    coupon_code: string
}

interface ResetPromotionActionParams {
    dispatch: AppDispatch,
    setRefresh: (refresh: boolean) => void,
    refresh: boolean,
}

interface CreateOrderParams {
    dispatch: AppDispatch,
    axiosClientJwt: AxiosInstance,
    toast: CreateToastFnReturn,
    navigate: Function
    order: OrderCreate
}

interface OrderCreate {
    address_id: number,
    payment_method: PaymentMethod,
    product_variant_id: number,
    quantity: number,
    promotion_id?: number
}

export const checkPromotion = async ({ axiosClient, dispatch, refresh, setError, setRefresh, toast, coupon_code }: CheckPromotionParams) => {
    try {
        dispatch(checkPromotionStart());
        const res: IAxiosResponse<{}> = await axiosClient.post('promotion/check-code', {
            coupon_code
        });
        if (res?.response?.code === 200 && res?.response?.success) {
            setTimeout(function () {
                dispatch(checkPromotionSuccess(res.response.data));
                setRefresh(!refresh)
            }, 1000);
        } else if (res?.response?.code === 400 && !res?.response?.success) {
            setTimeout(function () {
                dispatch(checkPromotionFailed(null));
                setError(res.response.fieldError, { message: res.response.message })
            }, 1000);
        } else if (res?.response?.code === 404 && !res?.response?.success) {
            setTimeout(function () {
                dispatch(checkPromotionFailed(null));
                setError(res.response.fieldError, { message: res.response.message })
            }, 1000);
        } else {
            dispatch(checkPromotionFailed(null));
        }
    } catch (error) {
        dispatch(checkPromotionFailed(null));
        toast({
            status: 'error',
            title: "Something went wrong!",
            isClosable: true,
        })
    }
}

export const resetPromotionAction = ({ dispatch, refresh, setRefresh }: ResetPromotionActionParams) => {
    setTimeout(function () {
        dispatch(resetPromotion());
        setRefresh(!refresh)
    }, 1000);
}

export const createOrderByPayment = async (axiosClientJwt: AxiosInstance, order: OrderCreate) => {
    try {
        const { address_id, payment_method, product_variant_id, quantity, promotion_id } = order;
        const accessToken = localStorage.getItem("accessToken")
        return await axiosClientJwt.post('/order/payment', {
            address_id,
            payment_method,
            product_variant_id,
            quantity,
            promotion_id
        }, {
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        });
    } catch (error) {
        console.log(error)
    }
}

export const createOrder = async ({ axiosClientJwt, dispatch, navigate, order, toast }: CreateOrderParams) => {
    try {
        const { address_id, payment_method, product_variant_id, quantity, promotion_id } = order;
        const accessToken = localStorage.getItem("accessToken")
        dispatch(createOrderStart());
        const res: IAxiosResponse<{}> = await axiosClientJwt.post('/order/create', {
            address_id,
            payment_method,
            product_variant_id,
            quantity,
            promotion_id
        }, {
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        });
        if (res?.response?.code === 200 && res?.response?.success) {
            setTimeout(function () {
                dispatch(createOrderSuccess(res.response.data));
                dispatch(resetPromotion())
                toast({
                    status: 'success',
                    title: "Successfully!",
                    position: "top-right",
                    isClosable: true,
                })
                navigate('/account')
            }, 1000)
        } else {
            dispatch(createOrderFailed(null));
        }
    } catch (error: any) {
        dispatch(createOrderFailed(null));
        if (error?.response?.status === 403 && error?.response?.statusText === "Forbidden") {
            toast({
                status: 'error',
                title: "You do not have permission to perform this action!",
                isClosable: true,
            })
        } else {
            toast({
                status: 'error',
                title: "Something went wrong!",
                isClosable: true,
            })
        }
    }
}