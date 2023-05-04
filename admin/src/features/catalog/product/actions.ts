import { AppDispatch } from "src/app/store";
import { Inotification } from 'src/common';
import type { Axios } from "axios";
import { ProductType, createProductFailed, createProductStart, createProductSuccess } from "./productSlice";
import { IAxiosResponse } from "src/types/axiosResponse";

export type CreateProductParams = {
    dispatch: AppDispatch,
    axiosClient: Axios,
    product: Product
}

export type Product = {
    name: string
    description?: string
    slug: string
    enabled: boolean
}

export const createProduct = async ({ product, dispatch, axiosClient }: CreateProductParams) => {
    const { slug, enabled, description, name } = product
    dispatch(createProductStart());
    try {
        const res: IAxiosResponse<ProductType> = await axiosClient.post(`/admin/product/create`, {
            slug,
            enabled,
            description,
            name
        });
        if (res?.response?.code === 200 && res?.response?.success) {
            setTimeout(function () {
                dispatch(createProductSuccess(res.response.data));
            }, 1000);
        } else {
            dispatch(createProductFailed({
                fieldError: res.response.fieldError,
                message: res.response.message
            }));
        }
    } catch (error) {
        dispatch(createProductFailed(null));
        Inotification({
            type: 'error',
            message: 'Something went wrong!'
        })
    }
}