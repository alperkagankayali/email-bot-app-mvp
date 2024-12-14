import { jsonToQueryString, servicesBaseUrl } from "@/constants";
import { getRequest, postRequest } from "../client/client";
import finalConfig from "@/lib/config.json";
import headers from "@/lib/header.json";
import { IResponseType } from "@/types/responseType";
import { INewsBlog } from "@/types/newsType";

export const getNews = async (limit = 10, page = 1, id: string) => {
  const queryParams = jsonToQueryString({ limit, page, id });
  const url = servicesBaseUrl + finalConfig.GET_NEWS + queryParams;
  const config = headers.content_type.application_json;
  const result: IResponseType = await getRequest(url, config);
  return result;
};
export const updateNews = async (id: string, updateData: any) => {
  const url = servicesBaseUrl + finalConfig.UPDATE_NEWS;
  const config = headers.content_type.application_json;
  const result: IResponseType = await postRequest(
    url,
    { id, updateData },
    config
  );
  return result;
};

export const createNews = async (data: INewsBlog) => {
  const url = servicesBaseUrl + finalConfig.ADD_NEWS;
  const config = headers.content_type.application_json;
  const result: IResponseType = await postRequest(url, data, config);
  return result;
};
