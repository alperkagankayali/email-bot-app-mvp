"use server";
import { cookies } from "next/headers";
const { createCodec } = require("json-crypto");
import jwt from "jsonwebtoken";
import finalConfig from "@/lib/config.json";
import { headers } from "next/headers";
import { redirect } from "@/i18n/routing";

export async function logoutUser() {
  const cookieStore = await cookies();
  cookieStore.delete("currentUser");
}

export async function getCookieUser() {
  //   const cookieStore = await cookies();
  //   const cookieKey: string = process.env.COOKIE_SCREET_KEY as string;
  //   const currentUser = cookieStore.get("currentUser");
  //   const jwtKey: string = process.env.JWT_SCREET_KEY as string;
  //   console.log("currentUser", currentUser);
  //   const codec = createCodec(cookieKey);
  //   const secret = codec.decrypt(currentUser?.value);
  //   let data = await fetch(servicesBaseUrl + finalConfig.GET_AUTHORIZATION, {
  //     headers: {
  //       Authorization: "Bearer " + secret?.token,
  //     },
  //   });
  //   const headersList = headers();

  //   let auth = await data.json();
  //   const currentUrl = headersList.get("referer"); // Referer header'ı üzerinden path'ı alabilirsin

  //   console.log("Current URL:", currentUrl);
  //   const user = jwt.verify(secret?.token, jwtKey) as any;
  //   auth?.data?.forEach((element: any) => {
  //     if (
  //       currentUrl?.includes(element?.page?.url) &&
  //       element?.role === user?.role &&
  //       !element.isAuthorization
  //     ) {
  //       redirect("/");
  //     }
  //   });
  //   return user;
  return "";
}
