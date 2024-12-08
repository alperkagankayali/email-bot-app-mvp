import { servicesBaseUrl } from "@/constants";
import finalConfig from "@/lib/config.json";
import headers from "@/lib/header.json";
import { IResponseType } from "@/types/responseType";
import { postRequest } from "../client/client";

export const sendVerificationEmail = async (userId: string) => {
    const url = servicesBaseUrl + finalConfig.SEND_EMAIL;
    const config = headers.content_type.application_json;
    const VERIFICATION_EMAIL_ID = process.env.VERIFICATION_EMAIL_ID || "672dd687d5e9ef7ad872fc35"; //Placeholder id, needs to be replaced with the actual verification email id.
    const data = {"userId": userId, "emailId": VERIFICATION_EMAIL_ID, "senderAddress": process.env.DEFAULT_SENDER_ADDRESS || "info@klinikermed.com", "isEmailTracked": false};

    console.log(data, "this is data");
    const result = await postRequest(url, data, config);
    return result;
};

