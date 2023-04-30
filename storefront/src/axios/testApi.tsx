import axiosClient from "./axios";

const testApi = {
  getPost: (params:string) => {
    const url = `/${params}`;
    return axiosClient.get(url);
  },
};
export default testApi;