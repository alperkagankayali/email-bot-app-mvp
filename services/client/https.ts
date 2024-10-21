
import axios from 'axios'

const instance = axios.create({
  headers: {
    Authorization: ""
  }
})

instance.interceptors.request.use((config) => {
  return config
}, error => {
  return Promise.reject(error)
})

instance.interceptors.response.use((response) => {
  return response;
}, error => {

  console.log('interceptor', error);
  if (error.response.status === 401) {
    console.log(error.response.status)
  }
  if (error.response) {
    return error.response.data;
  } else {
    return Promise.reject(error)
  }
})

export const http = instance