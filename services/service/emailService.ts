import { servicesBaseUrl } from "@/constants";
import finalConfig from "@/lib/config.json";
import headers from "@/lib/header.json";
import { postRequest } from "../client/client";

export const sendVerificationEmail = async (
  userId: string,
  variables: Record<string, string>,
  emailId: string
) => {
  const url = servicesBaseUrl + finalConfig.SEND_EMAIL;
  const config = headers.content_type.application_json;
  const VERIFICATION_EMAIL_ID = emailId; //Placeholder id, needs to be replaced with the actual verification email id.
  const data = {
    userId: userId,
    emailId,
    senderAddress: process.env.DEFAULT_SENDER_ADDRESS ?? "info@klinikermed.com",
    isEmailTracked: false,
    varibles: variables,
  };
  const result = await postRequest(url, data, config);
  return result;
};
