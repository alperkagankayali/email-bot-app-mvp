import { getTokenFromCookie, servicesBaseUrl } from "@/constants";
import axios from "axios";

// Token'ı global olarak tutmak yerine her request için yeniden alacağız
const instance = axios.create({
  baseURL: servicesBaseUrl,
  withCredentials: true, // Cookie gönderimini aktif eder
});

instance.interceptors.request.use(
  async (config) => {
    if (typeof window !== "undefined") {
      let token = JSON.parse(localStorage.getItem("token") ?? "");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
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
    if (error.response?.status === 401) {
      if (typeof window !== "undefined") {
        document.cookie =
          "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
        document.cookie =
          "currentUser=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
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
