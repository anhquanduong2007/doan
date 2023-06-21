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
    updateProductVariantFailed,
    updateProductOptionStart,
    updateProductOptionSuccess,
    updateProductOptionFailed,
    deleteProductVariantStart,
    deleteProductVariantSuccess,
    deleteProductVariantFailed
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
    active: boolean;
    featured_asset_id?: number;
};

export type ProductOption = {
    name: string;
    value: Array<string>;
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
    origin_price: number
    sku: string
    stock: number
    featured_asset_id?: number
}

export type ProductUpdate = {
    name: string
    description?: string
    active: number
    featured_asset_id?: number
    category_id?: number | null
}

export type ProductVariantOption = {
    value: string
}

type UpdateProductOptionParams = Omit<UpdateProductVariantParams, "productVariant" | "setError"> & {
    productOption: ProductVariantOption,
}

type DeleteProductVariantParams = DeleteProductParams

export const createProduct = async ({
    product,
    dispatch,
    axiosClient,
}: CreateProductParams) => {
    const { active, description, name, featured_asset_id } = product;
    dispatch(createProductStart());
    try {
        const accessToken = localStorage.getItem("accessToken");
        const res: IAxiosResponse<{}> = await axiosClient.post(
            `/product/create`,
            {
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
    navigate,
    message,
    setError
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
                navigate("/catalog/products");
                message.success("Create product successfully!");
            }, 1000);
        } else {
            dispatch(
                createProductVariantFailed({
                    fieldError: res.response.fieldError,
                    message: res.response.message,
                }),
            );
            //show error when create product variant failed
            setError(res.response.fieldError, { message: res.response.message });

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
        const { skip, take, search, status } = pagination;
        const accessToken = localStorage.getItem("accessToken")
        dispatch(getListProductStart());
        const res: IAxiosResponse<{}> = await axiosClientJwt.get('/product', {
            params: {
                ...pagination?.take && { take },
                ...pagination?.skip && { skip },
                ...pagination?.search && { search },
                ...pagination?.status && { status },
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
        const { active, name, description, featured_asset_id, category_id } = product;
        const accessToken = localStorage.getItem("accessToken")
        dispatch(updateProductStart());
        const [res]: [IAxiosResponse<{}>] = await Promise.all([
            await axiosClientJwt.put(`/product/update/${id}`, {
                active,
                name,
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
        const { name, price, sku, stock, featured_asset_id, origin_price } = productVariant;
        const accessToken = localStorage.getItem("accessToken")
        dispatch(updateProductVariantStart());
        const [res]: [IAxiosResponse<{}>] = await Promise.all([
            await axiosClientJwt.put(`/product/variant/update/${id}`, {
                name,
                price,
                sku,
                stock,
                origin_price,
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

export const updateProductOption = async ({ productOption, setIsModalOpen, axiosClientJwt, dispatch, navigate, message, id, refresh, setRefresh }: UpdateProductOptionParams) => {
    try {
        const { value } = productOption;
        const accessToken = localStorage.getItem("accessToken")
        dispatch(updateProductOptionStart());
        const [res]: [IAxiosResponse<{}>] = await Promise.all([
            await axiosClientJwt.put(`/product/option/update/${id}`, {
                value

            }, {
                headers: {
                    Authorization: `Bearer ${accessToken}`
                }
            }),
        ])
        if (res?.response?.code === 200 && res?.response?.success) {
            setTimeout(function () {
                dispatch(updateProductOptionSuccess(res.response.data));
                message.success('Update product option successfully!');
                setIsModalOpen(false)
                setRefresh(!refresh)
            }, 1000)
        } else {
            dispatch(updateProductOptionFailed(null));
        }
    } catch (error: any) {
        dispatch(updateProductOptionFailed(null));
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

export const deleteProductVariant = async ({ id, dispatch, axiosClientJwt, navigate, message, refresh, setIsModalOpen, setRefresh }: DeleteProductVariantParams) => {
    try {
        dispatch(deleteProductVariantStart());
        const accessToken = localStorage.getItem("accessToken")
        const res: IAxiosResponse<{}> = await axiosClientJwt.delete(`/product/variant/delete/${id}`, {
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        });
        if (res?.response?.code === 200 && res?.response?.success) {
            setTimeout(function () {
                dispatch(deleteProductVariantSuccess(res.response.data))
                message.success('Delete product variant successfully!')
                setIsModalOpen(false)
                setRefresh(!refresh)
            }, 1000);
        } else {
            dispatch(deleteProductVariantFailed(null));
            setTimeout(function () {
                setIsModalOpen(false)
            }, 1000)

        }
    } catch (error: any) {
        dispatch(deleteProductVariantFailed(null));
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
