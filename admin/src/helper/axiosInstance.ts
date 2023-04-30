import axios from 'axios';
import queryString from "query-string";
import jwtDecode, { JwtPayload } from "jwt-decode";
import { AuthLoginResponse } from 'src/types';
import { AppDispatch } from 'src/app/store';

const refreshToken = async () => {
    try {
        const res = await axios.post('http://localhost:3030/auth/refreshToken', {
            withCredentials: true,
        })
        return res?.data
    } catch (error) {
        console.log(error)
    }
}
export const createAxiosJwt = (user: AuthLoginResponse, dispatch: AppDispatch, stateSuccess: Function) => {
    const newInstance = axios.create({
        baseURL: import.meta.env.VITE_BACKEND_URL,
        headers: {
            "content-type": "application/json",
        },
        withCredentials: true,
        paramsSerializer: (params) => queryString.stringify(params),
    });
    newInstance.interceptors.request.use(
        async (config) => {
            let date = new Date();
            const decoedToken: JwtPayload = jwtDecode(user?.response?.accessToken);
            if (decoedToken?.exp && decoedToken?.exp < date.getTime() / 1000) {
                const data = await refreshToken();
                const refreshUser = {
                    ...user,
                    response: {
                        ...user.response,
                        accessToken: data?.response?.accessToken
                    }
                }
                dispatch(stateSuccess(refreshUser));
                if (!config?.headers) {
                    throw new Error(`Expected 'config' and 'config.headers' not to be undefined`);
                }
                config.headers.Authorization = `Bearer ${data?.accessToken}`;
            }
            return config;
        },
        (error: any) => {
            return Promise.reject(error);
        }
    );
    newInstance.interceptors.response.use(
        (response) => {
            if (response && response.data) {
                return response.data;
            }
            return response;
        },
        (error) => {
            throw error;
        }
    );
    return newInstance;
}

export const createAxiosClient = () => {
    const newInstance = axios.create({
        baseURL: import.meta.env.VITE_BACKEND_URL,
        headers: {
            "content-type": "application/json",
        },
        // withCredentials: true,
        paramsSerializer: (params) => queryString.stringify(params),
    });
    newInstance.interceptors.request.use(
        (config) => {
            return config;
        },
        (error) => {
            return Promise.reject(error);
        }
    );
    newInstance.interceptors.response.use(
        (response) => {
            if (response && response.data) {
                return response.data;
            }
            return response;
        },
        (error) => {
            throw error;
        }
    );
    return newInstance;
}