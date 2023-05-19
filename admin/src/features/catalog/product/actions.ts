import { AppDispatch } from "src/app/store";
import { Inotification } from "src/common";
import type { Axios, AxiosInstance } from "axios";
import {
    createProductFailed,
    createProductStart,
    createProductSuccess,
    createProductOptionFailed,
    createProductOptionStart,
    createProductOptionSuccess,
    createProductVariantSuccess,
    createProductVariantFailed,
    createProductVariantStart,
    getListProductStart,
    getListProductSuccess,
    getListProductFailed,
    deleteProductStart,
    deleteProductSuccess,
    deleteProductFailed,
    getProductStart,
    getProductSuccess,
    getProductFailed,
    updateProductStart,
    updateProductSuccess,
    updateProductFailed,
    updateProductVariantStart,
    updateProductVariantSuccess,
    updateProductVariantFailed
} from "./productSlice";
import { IAxiosResponse } from "src/types/axiosResponse";
import { Pagination } from "src/types";
import { NavigateFunction } from "react-router-dom";
import { MessageApi } from "antd/lib/message";
import { UseFormSetError } from "react-hook-form";
import { FormValuesProduct } from "src/components/Catalog/Products/detail-update/ProductDetail";
import { FormValuesProductVariant } from "src/components/Catalog/Products/detail-update/ModalUpdateProductVariant";

export type CreateProductParams = {
    dispatch: AppDispatch;
    axiosClient: Axios;
    product: Product;
};

export type Product = {
    name: string;
    description?: string;
    slug: string;
    active: boolean;
    featured_asset_id?: number;
};

export type ProductOption = {
    name: string;
    value: Array<string>;
};

type ProductOptionType = {
    [key: string]: ProductOption;
};
export type CreateProductOptionParams = {
    dispatch: AppDispatch;
    axiosClient: Axios;
    options: any;
};

export interface GetListProductParams {
    dispatch: AppDispatch,
    axiosClientJwt: AxiosInstance,
    pagination: Pagination,
    navigate: NavigateFunction
}

export type DeleteProductParams = Omit<GetListProductParams, "pagination">
    & {
        id: number,
        setIsModalOpen: (open: boolean) => void,
        setRefresh: (refresh: boolean) => void,
        refresh: boolean,
        message: MessageApi
    }

export type GetProductParams = Omit<GetListProductParams, "pagination"> & { id: number }

type UpdateProductParams = Omit<GetListProductParams, "pagination"> & {
    product: ProductUpdate,
    id: number,
    setError: UseFormSetError<FormValuesProduct>,
    message: MessageApi,
    setRefresh: (refresh: boolean) => void,
    refresh: boolean,
}

type UpdateProductVariantParams = Omit<GetListProductParams, "pagination"> & {
    productVariant: ProductVariantUpdate,
    id: number,
    setError: UseFormSetError<FormValuesProductVariant>,
    message: MessageApi,
    setIsModalOpen: (open: boolean) => void,
    setRefresh: (refresh: boolean) => void,
    refresh: boolean,
}

export type ProductVariantUpdate = {
    name: string
    price: number
    sku: string
    stock: number
    featured_asset_id?: number
}

export type ProductUpdate = {
    name: string
    slug: string
    description?: string
    active: number
    featured_asset_id?: number
    category_id?: number | null
}

export const createProduct = async ({
    product,
    dispatch,
    axiosClient,
}: CreateProductParams) => {
    const { slug, active, description, name, featured_asset_id } = product;
    dispatch(createProductStart());
    try {
        const accessToken = localStorage.getItem("accessToken");
        const res: IAxiosResponse<{}> = await axiosClient.post(
            `/product/create`,
            {
                slug,
                active,
                description,
                name,
                featured_asset_id
            },
            {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            },
        );
        if (res?.response?.code === 200 && res?.response?.success) {
            setTimeout(function () {
                dispatch(createProductSuccess(res.response.data));
            }, 1000);
        } else {
            dispatch(
                createProductFailed({
                    fieldError: res.response.fieldError,
                    message: res.response.message,
                }),
            );
        }
    } catch (error) {
        dispatch(createProductFailed(null));
        Inotification({
            type: "error",
            message: "Something went wrong!",
        });
    }
};

export const createProductOption = async ({
    options,
    dispatch,
    axiosClient,
}: CreateProductOptionParams) => {
    dispatch(createProductOptionStart());
    try {
        const accessToken = localStorage.getItem("accessToken");
        const res: IAxiosResponse<{}> = await axiosClient.post(
            `/product/option/bulk-create`,
            { options: options },
            {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            },
        );
        if (res?.response?.code === 200 && res?.response?.success) {
            setTimeout(function () {
                dispatch(createProductOptionSuccess(res.response.data));
            }, 1000);
        } else {
            dispatch(
                createProductOptionFailed({
                    fieldError: res.response.fieldError,
                    message: res.response.message,
                }),
            );
        }
    } catch (error) {
        dispatch(createProductOptionFailed(null));
        Inotification({
            type: "error",
            message: "Something went wrong!",
        });
    }
};

export const createProductVariantOption = async ({
    variants,
    dispatch,
    axiosClient,
}: any) => {
    dispatch(createProductVariantStart());
    try {
        const accessToken = localStorage.getItem("accessToken");
        const res: IAxiosResponse<{}> = await axiosClient.post(
            `/product/variant/bulk-create`,
            { variants },
            {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            },
        );
        if (res?.response?.code === 200 && res?.response?.success) {
            setTimeout(function () {
                dispatch(createProductVariantSuccess(res.response.data));
            }, 1000);
        } else {
            dispatch(
                createProductVariantFailed({
                    fieldError: res.response.fieldError,
                    message: res.response.message,
                }),
            );
        }
    } catch (error) {
        dispatch(createProductVariantFailed(null));
        Inotification({
            type: "error",
            message: "Something went wrong!",
        });
    }
};

export const getListProduct = async ({ pagination, dispatch, axiosClientJwt, navigate }: GetListProductParams) => {
    try {
        const { skip, take, search } = pagination;
        const accessToken = localStorage.getItem("accessToken")
        dispatch(getListProductStart());
        const res: IAxiosResponse<{}> = await axiosClientJwt.get('/product', {
            params: {
                ...pagination?.take && { take },
                ...pagination?.skip && { skip },
                ...pagination?.search && { search },
            },
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        });
        if (res?.response?.code === 200 && res?.response?.success) {
            setTimeout(function () {
                dispatch(getListProductSuccess(res.response.data));
            }, 1000)
        } else {
            dispatch(getListProductFailed(null));
        }
    } catch (error: any) {
        dispatch(getListProductFailed(null));
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

export const deleteProduct = async ({ id, dispatch, axiosClientJwt, navigate, message, refresh, setIsModalOpen, setRefresh }: DeleteProductParams) => {
    try {
        dispatch(deleteProductStart());
        const accessToken = localStorage.getItem("accessToken")
        const res: IAxiosResponse<{}> = await axiosClientJwt.delete(`/product/delete/${id}`, {
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        });
        if (res?.response?.code === 200 && res?.response?.success) {
            setTimeout(function () {
                dispatch(deleteProductSuccess(res.response.data))
                message.success('Delete product successfully!')
                setIsModalOpen(false)
                setRefresh(!refresh)
            }, 1000);
        } else {
            dispatch(deleteProductFailed(null));
            setTimeout(function () {
                setIsModalOpen(false)
            }, 1000)

        }
    } catch (error: any) {
        dispatch(deleteProductFailed(null));
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

export const getProduct = async ({ id, dispatch, axiosClientJwt, navigate }: GetProductParams) => {
    try {
        const accessToken = localStorage.getItem("accessToken")
        dispatch(getProductStart());
        const res: IAxiosResponse<{}> = await axiosClientJwt.get(`/product/${id}`, {
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        });
        if (res?.response?.code === 200 && res?.response?.success) {
            setTimeout(function () {
                dispatch(getProductSuccess(res.response.data));
            }, 1000)
        } else {
            dispatch(getProductFailed(null));
        }
    } catch (error: any) {
        dispatch(getProductFailed(null));
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


export const updateProduct = async ({ product, axiosClientJwt, dispatch, navigate, setError, message, id, refresh, setRefresh }: UpdateProductParams) => {
    try {
        const { active, name, slug, description, featured_asset_id, category_id } = product;
        const accessToken = localStorage.getItem("accessToken")
        dispatch(updateProductStart());
        const [res]: [IAxiosResponse<{}>] = await Promise.all([
            await axiosClientJwt.put(`/product/update/${id}`, {
                active,
                name,
                slug,
                description,
                featured_asset_id,
                category_id
            }, {
                headers: {
                    Authorization: `Bearer ${accessToken}`
                }
            }),
        ])
        if (res?.response?.code === 200 && res?.response?.success) {
            setTimeout(function () {
                dispatch(updateProductSuccess(res.response.data));
                message.success('Update product successfully!');
                setRefresh(!refresh)
            }, 1000)
        } else if (res?.response?.code === 400 && !res?.response?.success) {
            dispatch(updateProductFailed(null));
            setError(res?.response?.fieldError as keyof FormValuesProduct, { message: res?.response?.message })
        } else {
            dispatch(updateProductFailed(null));
        }
    } catch (error: any) {
        dispatch(updateProductFailed(null));
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

export const updateProductVariant = async ({ productVariant, setIsModalOpen, axiosClientJwt, dispatch, navigate, setError, message, id, refresh, setRefresh }: UpdateProductVariantParams) => {
    try {
        const { name, price, sku, stock, featured_asset_id } = productVariant;
        const accessToken = localStorage.getItem("accessToken")
        dispatch(updateProductVariantStart());
        const [res]: [IAxiosResponse<{}>] = await Promise.all([
            await axiosClientJwt.put(`/product/variant/update/${id}`, {
                name,
                price,
                sku,
                stock,
                featured_asset_id

            }, {
                headers: {
                    Authorization: `Bearer ${accessToken}`
                }
            }),
        ])
        if (res?.response?.code === 200 && res?.response?.success) {
            setTimeout(function () {
                dispatch(updateProductVariantSuccess(res.response.data));
                message.success('Update product variant successfully!');
                setIsModalOpen(false)
                setRefresh(!refresh)
            }, 1000)
        } else if (res?.response?.code === 400 && !res?.response?.success) {
            dispatch(updateProductVariantFailed(null));
            setError(res?.response?.fieldError as keyof FormValuesProductVariant, { message: res?.response?.message })
        } else {
            dispatch(updateProductVariantFailed(null));
        }
    } catch (error: any) {
        dispatch(updateProductVariantFailed(null));
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
