import { jsonToQueryString } from "@/constants";
import { getRequest } from "../client/client";
import finalConfig from "@/lib/config.json";
import headers from "@/lib/header.json";

const servicesBaseUrl = "http://localhost:3000/api";

export const getLanguage = async () => {
  const url = servicesBaseUrl + finalConfig.GET_LANGUAGES;
  const config = headers.content_type.application_json;
  const result = await getRequest(url, config);
  return result;
};

export const getResource = async (params: { code: string }) => {
  const url =
    servicesBaseUrl + finalConfig.CREATE_RESOURCES + jsonToQueryString(params);
  const config = headers.content_type.application_json;
  const result = await getRequest(url, config);
  return result;
};
