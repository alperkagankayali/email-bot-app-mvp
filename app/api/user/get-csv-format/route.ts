import connectToDatabase from "@/lib/mongoose";
import { NextResponse } from "next/server";
export const dynamic = "force-dynamic"; // <- add this to force dynamic render
import jwt from "jsonwebtoken";
import { ISuperAdminJWT, IUserJWT } from "../login/route";
import {  message401, message500 } from "@/constants";
import xlsx, { IJsonSheet, ISettings } from "json-as-xlsx";

const data: IJsonSheet[] = [
  {
    sheet: "Adults",
    columns: [
      { label: "Name", value: "name" },
      { label: "Age", value: "age", format: '# "years"' },
    ],
    content: [
      { name: "Monserrat", age: 21, more: { phone: "11111111" } },
      { name: "Luis", age: 22, more: { phone: "12345678" } },
    ],
  },
  {
    sheet: "Pets",
    columns: [
      { label: "Name", value: "name" },
      { label: "Age", value: "age" },
    ],
    content: [
      { name: "Malteada", age: 4, more: { phone: "99999999" } },
      { name: "Picadillo", age: 1, more: { phone: "87654321" } },
    ],
  },
];
const settings: ISettings = {
  writeOptions: {
    type: "buffer",
    bookType: "xlsx",
  },
};
export async function GET(request: Request) {
  try {
    await connectToDatabase();
    const token = request.headers.get("authorization"); // API anahtarı kontrolü
    const jwtKey: string = process.env.JWT_SCREET_KEY as string;
    if (!!token) {
      const user = jwt.verify(token.split(" ")[1], jwtKey) as IUserJWT;
      if (user.role === "admin") {
        const buffer = xlsx(data, settings);
        return NextResponse.json(buffer);
      } else {
        const jwtSuperAdmin = jwt.verify(
          token.split(" ")[1],
          jwtKey
        ) as ISuperAdminJWT;
        if (jwtSuperAdmin.role === "superadmin") {
          const buffer = xlsx(data, settings);
          return NextResponse.json(buffer);
        }
        return NextResponse.json(
          {
            ...message401,
          },
          { status: 401, statusText: message401.message }
        );
      }
    } else {
      return NextResponse.json(
        {
          ...message401,
        },
        { status: 401, statusText: message401.message }
      );
    }
  } catch (error: any) {
    return NextResponse.json(
      { ...message500 },
      { status: 500, statusText: error?.message || "" }
    );
  }
}
