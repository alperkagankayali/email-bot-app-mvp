import { jsonToQueryString, servicesBaseUrl } from "@/constants";
import { getRequest, postRequest } from "../client/client";
import finalConfig from "@/lib/config.json";
import headers from "@/lib/header.json";
import { IResponseType } from "@/types/responseType";
import { IArticleType } from "@/types/articleType";
import { IVideoType } from "@/types/videoType";
import { IQuizType } from "@/types/quizType";

export const getVideo = async (filter: any) => {
  const queryParams = jsonToQueryString(filter);
  const url = servicesBaseUrl + finalConfig.GET_VIDEO + queryParams;
  const config = headers.content_type.application_json;
  const result: IResponseType = await getRequest(url, config);
  return result;
};
export const getArticle = async (filter: any) => {
  const queryParams = jsonToQueryString(filter);
  const url = servicesBaseUrl + finalConfig.GET_ARTICLE + queryParams;
  const config = headers.content_type.application_json;
  const result: IResponseType = await getRequest(url, config);
  return result;
};
export const createArticle = async (data: IArticleType) => {
  const url = servicesBaseUrl + finalConfig.ADD_ARTICLE;
  const config = headers.content_type.application_json;
  const result: IResponseType = await postRequest(url, data, config);
  return result;
};
export const createVideo = async (data: IVideoType) => {
  const url = servicesBaseUrl + finalConfig.ADD_VIDEO;
  const config = headers.content_type.application_json;
  const result: IResponseType = await postRequest(url, data, config);
  return result;
};
export const createQuiz = async (data: IQuizType) => {
  const url = servicesBaseUrl + finalConfig.ADD_QUIZO;
  const config = headers.content_type.application_json;
  const result: IResponseType = await postRequest(url, data, config);
  return result;
};
export const createEducation = async (data: any) => {
  const url = servicesBaseUrl + finalConfig.ADD_EDUCATION_CONTENT;
  const config = headers.content_type.application_json;
  const result: IResponseType = await postRequest(url, data, config);
  return result;
};
export const getQuiz = async (filter: any) => {
  const queryParams = jsonToQueryString(filter);
  const url = servicesBaseUrl + finalConfig.GET_QUIZ + queryParams;
  const config = headers.content_type.application_json;
  const result: IResponseType = await getRequest(url, config);
  return result;
};
export const deleteQuiz = async (id: string) => {
  const url = servicesBaseUrl + finalConfig.DELETE_QUIZ;
  const config = headers.content_type.application_json;
  const result: IResponseType = await postRequest(url, { id }, config);
  return result;
};
export const getEducationContent = async (limit = 10, page = 1) => {
  const queryParams = jsonToQueryString({ limit, page });
  const url = servicesBaseUrl + finalConfig.GET_EDUCATION_CONTENT + queryParams;
  const config = headers.content_type.application_json;
  const result: IResponseType = await getRequest(url, config);
  return result;
};

export const getEducationListContent = async (
  limit = 10,
  page = 1,
  values = {}
) => {
  const queryParams = jsonToQueryString({ limit, page, ...values });
  const url = servicesBaseUrl + finalConfig.GET_EDUCATION_LIST + queryParams;
  const config = headers.content_type.application_json;
  const result: IResponseType = await getRequest(url, config);
  return result;
};

export const getEducationDetail = async (id: string) => {
  const queryParams = jsonToQueryString({ id });
  const url =
    servicesBaseUrl + finalConfig.GET_BY_ID_EDUCATION_CONTENT + queryParams;
  const config = headers.content_type.application_json;
  const result: IResponseType = await getRequest(url, config);
  return result;
};

export const deleteArticle = async (id: string) => {
  const url = servicesBaseUrl + finalConfig.DELETE_ARTICLE;
  const config = headers.content_type.application_json;
  const result: IResponseType = await postRequest(url, { id }, config);
  return result;
};

export const deleteVideo = async (id: string) => {
  const url = servicesBaseUrl + finalConfig.DELETE_VIDEO;
  const config = headers.content_type.application_json;
  const result: IResponseType = await postRequest(url, { id }, config);
  return result;
};

export const deleteEducation = async (id: string) => {
  const url = servicesBaseUrl + finalConfig.DELETE_EDUCATION_CONTENT;
  const config = headers.content_type.application_json;
  const result: IResponseType = await postRequest(url, { id }, config);
  return result;
};

export const deleteEducationList = async (id: string) => {
  const url = servicesBaseUrl + finalConfig.DELETE_EDUCATION_LIST;
  const config = headers.content_type.application_json;
  const result: IResponseType = await postRequest(url, { id }, config);
  return result;
};


export const updateArticle = async (id: string, updateData: any) => {
  const url = servicesBaseUrl + finalConfig.UPDATE_ARTICLE;
  const config = headers.content_type.application_json;
  const result: IResponseType = await postRequest(
    url,
    { id, updateData },
    config
  );
  return result;
};

export const updateVideo = async (id: string, updateData: any) => {
  const url = servicesBaseUrl + finalConfig.UPDATE_VIDEO;
  const config = headers.content_type.application_json;
  const result: IResponseType = await postRequest(
    url,
    { id, updateData },
    config
  );
  return result;
};

export const updateQuiz = async (id: string, updateData: any) => {
  const url = servicesBaseUrl + finalConfig.UPDATE_QUIZ;
  const config = headers.content_type.application_json;
  const result: IResponseType = await postRequest(
    url,
    { id, updateData },
    config
  );
  return result;
};

export const updateEducation = async (id: string, updateData: any) => {
  const url = servicesBaseUrl + finalConfig.UPDATE_EDUCATION_CONTENT;
  const config = headers.content_type.application_json;
  const result: IResponseType = await postRequest(
    url,
    { id, updateData },
    config
  );
  return result;
};

export const updateEducationList = async (id: string, updateData: any) => {
  const url = servicesBaseUrl + finalConfig.UPDATE_EDUCATION_LIST;
  const config = headers.content_type.application_json;
  const result: IResponseType = await postRequest(
    url,
    { id, updateData },
    config
  );
  return result;
};

export const createEducationList = async (data: any) => {
  const url = servicesBaseUrl + finalConfig.ADD_EDUCATION_LIST;
  const config = headers.content_type.application_json;
  const result: IResponseType = await postRequest(url, data, config);
  return result;
};

export const getEducationListRelationship = async (id: string[]) => {
  const url = servicesBaseUrl + finalConfig.GET_EDUCATION_LIST_RELATION;
  const config = headers.content_type.application_json;
  const result: IResponseType = await postRequest(url, { id }, config);
  return result;
};
