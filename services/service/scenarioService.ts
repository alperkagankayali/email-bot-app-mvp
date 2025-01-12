import { jsonToQueryString, servicesBaseUrl } from "@/constants";
import { getRequest, postRequest } from "../client/client";
import finalConfig from "@/lib/config.json";
import headers from "@/lib/header.json";
import { IResponseType } from "@/types/responseType";
import { IScenario } from "@/types/scenarioType";

export const getScenarioType = async () => {
  const url = servicesBaseUrl + finalConfig.GET_SCENARIO_TYPE;
  const config = headers.content_type.application_json;
  const result: IResponseType = await getRequest(url, config);
  return result;
};
export const getScenario = async (filter: any) => {
  const queryParams = jsonToQueryString(filter);
  const url = servicesBaseUrl + finalConfig.GET_SCENARIO + queryParams;
  const config = headers.content_type.application_json;
  const result: IResponseType = await getRequest(url, config);
  return result;
};

export const createScenario = async (data: IScenario | null) => {
  const url = servicesBaseUrl + finalConfig.CREATE_SCENARIO;
  const config = headers.content_type.application_json;
  const result: IResponseType = await postRequest(url, data, config);
  return result;
};

export const deleteScenario = async (id: string) => {
  const url = servicesBaseUrl + finalConfig.DELETE_SCENARIO;
  const config = headers.content_type.application_json;
  const result: IResponseType = await postRequest(url, { id }, config);
  return result;
};

export const updateScenario = async (id: string, updateData: any) => {
  const url = servicesBaseUrl + finalConfig.UPDATE_SCENARIO;
  const config = headers.content_type.application_json;
  const result: IResponseType = await postRequest(
    url,
    { id, updateData },
    config
  );
  return result;
};

export const updateScenarioEducationRelation = async (
  id: string,
  updateData: any,
  isDelete?: boolean
) => {
  const url = servicesBaseUrl + finalConfig.UPDATE_SCENARIO_RELATION;
  const config = headers.content_type.application_json;
  const result: IResponseType = await postRequest(
    url,
    { id, updateData, isDelete: isDelete ?? false },
    config
  );
  return result;
};
