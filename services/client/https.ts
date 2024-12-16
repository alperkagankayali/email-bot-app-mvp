import axios from "axios";

const instance = axios.create({
  headers: {
    Authorization: "",
  },
});

instance.interceptors.request.use(
  (config) => {
    if (typeof window !== "undefined") {
      const accessToken = JSON.parse(localStorage.getItem("token") || "{}");
      if (accessToken) {
        if (config.headers) {
          config.headers.Authorization = `Bearer ${accessToken}`;
        }
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
    if (error.response.status === 401) {
      if (typeof window !== "undefined") {
        localStorage.clear();
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
