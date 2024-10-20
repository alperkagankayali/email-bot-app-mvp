import { jsonToQueryString } from "@/constants";
import { getRequest, postRequest } from "../client/client";
import finalConfig from "@/lib/config.json";
import headers from "@/lib/header.json";

const servicesBaseUrl = "http://localhost:3000/api";

export const getLanguage = async () => {
  const url = servicesBaseUrl + finalConfig.GET_LANGUAGES;
  const config = headers.content_type.application_json;
  const result = await getRequest(url, config);
  return result;
};

export const getResource = async (code: string) => {
  const url =
    servicesBaseUrl + finalConfig.GET_RESOURCES + jsonToQueryString({ code });
  const config = headers.content_type.application_json;
  const result = await getRequest(url, config);
  return result;
};

export const handleLogin = async (email: string, password: string) => {
  const url = servicesBaseUrl + finalConfig.LOGIN;
  const config = headers.content_type.application_json;
  const result = await postRequest(url, { email, password }, config);
  return result;
};
