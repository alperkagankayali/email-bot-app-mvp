import { jsonToQueryString } from "@/constants";
import { getRequest, postRequest } from "../client/client";
import finalConfig from "@/lib/config.json";
import headers from "@/lib/header.json";
import { IResourceDb } from "@/types/resourcesType";

const servicesBaseUrl =
  process.env.NODE_ENV === "production"
    ? "https://email-bot-app-mvp-mx28.vercel.app/api"
    : `http://localhost:${process.env.PORT || 3000}/api`;

export const getLanguage = async (limit = 10, page = 1, isActive = true) => {
  const queryParams = jsonToQueryString({ isActive, limit, page });
  const url = servicesBaseUrl + finalConfig.GET_LANGUAGES + queryParams;
  const config = headers.content_type.application_json;
  const result = await getRequest(url, config);
  return result;
};

export const updateLanguage = async (id: string, updateData: any) => {
  const url = servicesBaseUrl + finalConfig.UPDATE_LANGUAGE;
  const config = headers.content_type.application_json;
  const result = await postRequest(url, { id, updateData }, config);
  return result;
};

export const getResource = async (code: string) => {
  const queryParams = jsonToQueryString({ code });
  const url = servicesBaseUrl + finalConfig.GET_RESOURCES + queryParams;
  const config = headers.content_type.application_json;
  const result = await getRequest(url, config);
  return result;
};

export const getResourceAll = async (limit = 10, page = 1, code = "") => {
  const queryParams = jsonToQueryString({ code, limit, page });
  const url = servicesBaseUrl + finalConfig.GET_ALL_RESOURCES + queryParams;
  const config = headers.content_type.application_json;
  const result = await getRequest(url, config);
  return result;
};
export const updateResource = async (id: string, updateData: any) => {
  const url = servicesBaseUrl + finalConfig.UPDATE_RESOURCE;
  const config = headers.content_type.application_json;
  const result = await postRequest(url, { id, updateData }, config);
  return result;
};

export const createResource = async (data: IResourceDb) => {
  const url = servicesBaseUrl + finalConfig.CREATE_RESOURCES;
  const config = headers.content_type.application_json;
  const result = await postRequest(url, data, config);
  return result;
};
export const handleLogin = async (email: string, password: string) => {
  const url = servicesBaseUrl + finalConfig.LOGIN;
  const config = headers.content_type.application_json;
  const result = await postRequest(url, { email, password }, config);
  return result;
};
