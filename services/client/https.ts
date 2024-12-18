import { servicesBaseUrl } from "@/constants";
import axios from "axios";

const instance = axios.create({
  baseURL: servicesBaseUrl,
  withCredentials: true, // Cookie gönderimini aktif eder
});

instance.interceptors.request.use(
  async (config) => {
    // if (typeof window !== "undefined") {
    //   const cookies = useCookies();
    //   const token = cookies.get('token');
    //   if (token) {
    //     if (config.headers) {
    //       config.headers.Authorization = `Bearer ${token}`;
    //     }
    //   }
    // }
    const fetchToken = await fetch(servicesBaseUrl + "/cookie?name=token");
    const res = await (await fetchToken).json();
    config.headers.Authorization = `Bearer ${res}`;
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

instance.interceptors.response.use(
  (response) => {
    return response.data;
  },
  (error) => {
    if (error.response.status === 401) {
      if (typeof window !== "undefined") {
        window.location.replace("/");
      }
    }
    if (error.response) {
      return error.response?.data;
    } else {
      return Promise.reject(error);
    }
  }
);

export const http = instance;
