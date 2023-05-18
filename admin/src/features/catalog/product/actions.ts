import { AppDispatch } from "src/app/store";
import { Inotification } from "src/common";
import type { Axios } from "axios";
import {
  ProductType,
  createProductFailed,
  createProductStart,
  createProductSuccess,
  createProductOptionFailed,
  createProductOptionStart,
  createProductOptionSuccess,
  createProductVariantSuccess,
  createProductVariantFailed,
  createProductVariantStart,
} from "./productSlice";
import { IAxiosResponse } from "src/types/axiosResponse";

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

export const createProduct = async ({
  product,
  dispatch,
  axiosClient,
}: CreateProductParams) => {
  const { slug, active, description, name } = product;
  dispatch(createProductStart());
  try {
    const accessToken = localStorage.getItem("accessToken");
    const res: IAxiosResponse<ProductType> = await axiosClient.post(
      `/product/create`,
      {
        slug,
        active,
        description,
        name,
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
    const res: IAxiosResponse<any> = await axiosClient.post(
      `/product/option/bulk-create`,
     {options: options},
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      },
    );
    console.log("optionsoptions==>", options)
    console.log("resres==>", res)
    if (res?.response?.code === 200 && res?.response?.success) {
      setTimeout(function () {
        console.log(res)
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
  console.log("variants", variants);
  dispatch(createProductVariantStart());
  try {
    const accessToken = localStorage.getItem("accessToken");
    const res: IAxiosResponse<any> = await axiosClient.post(
      `/product/variant/bulk-create`,
     {variants},
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
