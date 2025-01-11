import { jsonToQueryString, servicesBaseUrl } from "@/constants";
import { getRequest, postRequest } from "../client/client";
import finalConfig from "@/lib/config.json";
import headers from "@/lib/header.json";
import { IResponseType } from "@/types/responseType";
import { ICampaign } from "@/types/campaignType";

export const getCampaign = async (
  limit = 10,
  page = 1,
  id = "",
  filter?: {}
) => {
  const queryParams = jsonToQueryString({ limit, page, id, ...filter });
  const url = servicesBaseUrl + finalConfig.GET_CAMPAIGN + queryParams;
  const config = headers.content_type.application_json;
  const result: IResponseType = await getRequest(url, config);
  return result;
};
export const updateCampaign = async (id: string, updateData: any) => {
  const url = servicesBaseUrl + finalConfig.UPDATE_CAMPAIGN;
  const config = headers.content_type.application_json;
  const result: IResponseType = await postRequest(
    url,
    { id, updateData },
    config
  );
  return result;
};

export const createCampaign = async (data: ICampaign) => {
  const url = servicesBaseUrl + finalConfig.ADD_CAMPAIGN;
  const config = headers.content_type.application_json;
  const result: IResponseType = await postRequest(url, data, config);
  return result;
};
