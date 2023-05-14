import { AppDispatch } from "src/app/store";
import { getListAdministratorFailed, getListAdministratorStart, getListAdministratorSuccess } from "./administratorSlice";
import { Inotification } from 'src/common';
import { AxiosInstance } from "axios";
import { Pagination } from "src/types";
import { IAxiosResponse } from "src/types/axiosResponse";
import { User } from "src/types/user";
import { NavigateFunction } from "react-router-dom";

interface GetListAdministratorParams {
    dispatch: AppDispatch,
    axiosClientJwt: AxiosInstance,
    pagination: Pagination,
    navigate: NavigateFunction
}

export const getListAdministrator = async ({ pagination, dispatch, axiosClientJwt, navigate }: GetListAdministratorParams) => {
    const { skip, take } = pagination;
    const accessToken = localStorage.getItem("accessToken")
    dispatch(getListAdministratorStart());
    try {
        const res: IAxiosResponse<User> = await axiosClientJwt.get('/user/administrators', {
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
                dispatch(getListAdministratorSuccess(res.response.data));
            }, 1000);
        }
    } catch (error: any) {
        dispatch(getListAdministratorFailed(null));
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