import { AppDispatch } from "src/app/store";
import { loginStart, loginSuccess, loginFailed, logOutSuccess, logOutFailed, logOutStart } from "./authSlice";
import { Inotification } from 'src/common';
import { AuthLoginResponse } from "src/types";
import type { Axios } from "axios";

export const loginUser = async (user: { email: string, password: string }, dispatch: AppDispatch, navigate: Function, setError: Function, axiosClient: Axios) => {
    dispatch(loginStart());
    try {
        const res: AuthLoginResponse = await axiosClient.post('auth/login', user);
        if (res?.response?.code === 200 && res?.response?.success) {
            setTimeout(function () {
                dispatch(loginSuccess(res));
                navigate('/');
            }, 1000);
        }
        setTimeout(function () {
            dispatch(loginFailed());
            setError("password", {
                type: "checkUser",
                message: res?.response?.message
            });
        }, 1000)
    } catch (error) {
        dispatch(loginFailed());
        Inotification({
            type: 'error',
            message: 'Something went wrong!'
        })
    }
}

export const logOut = async (dispatch: AppDispatch, navigate: Function, accessToken: string, axiosClientJwt: any) => {
    dispatch(logOutStart());
    try {
        await axiosClientJwt.post('auth/logout',{}, {
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        })
        dispatch(logOutSuccess());
        navigate('/login');
    } catch (error) {
        console.log(error)
        dispatch(logOutFailed());
        Inotification({
            type: 'error',
            message: 'Something went wrong!'
        })
    }
}