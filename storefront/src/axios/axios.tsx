import axios from "axios";
import queryString from "query-string";

const axiosClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    "content-type": "application/json",
  },
  paramsSerializer: (params) => queryString.stringify(params),
});

axiosClient.interceptors.request.use(
  async config => {

    const token = localStorage.getItem('access_token')
    if (token) {
      // @ts-ignore
      config.headers!.Authorization = `Bearer ${token}`
    }
    //console.log(config)
    return config
 }, error => Promise.reject(error))


 // Add a response interceptor
 axiosClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    //const originalRequest = error.config;
    //if (error.response.status === 403 && !originalRequest._retry) {
    //  originalRequest._retry = true;
    //  const access_token = await refreshAccessToken();            
    //  axios.defaults.headers.common['Authorization'] = 'Bearer ' + access_token;
    //  return axiosInstance(originalRequest);
    //}
    //return Promise.reject(error);
    return Promise.reject((error.response && error.response.data) || 'Something went wrong')
  }
)

export const setAuthToken = (token?: string) => {
  if (token) {
    localStorage.setItem('access_token', token)
    axiosClient.defaults.headers.common.Authorization = `Bearer ${token}`   
  } else {
    localStorage.removeItem('access_token')
    delete axiosClient.defaults.headers.common.Authorization
  }
}

axios.interceptors.request.use(
  function (config) {
    return config;
  },
  function (error) {
    return Promise.reject(error);
  }
);

axiosClient.interceptors.response.use(
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
export default axiosClient;