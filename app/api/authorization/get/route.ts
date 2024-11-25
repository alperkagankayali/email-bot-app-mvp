import connectToDatabase from "@/lib/mongoose";
import { NextResponse } from "next/server";
export const dynamic = "force-dynamic"; // <- add this to force dynamic render
import jwt from "jsonwebtoken";
import { message200, message401, message500 } from "@/constants";
import { ISuperAdminJWT, IUserJWT } from "../../user/login/route";
import Authorization from "@/models/authorization";
import Pages from "@/models/pages";

export async function GET(request: Request) {
  try {
    await connectToDatabase();
    const token = request.headers.get("authorization"); // API anahtarı kontrolü
    const jwtKey: string = process.env.JWT_SCREET_KEY as string;
    if (!!token) {
      const user = jwt.verify(token.split(" ")[1], jwtKey) as IUserJWT;
      if (user.role === "admin" || user.role === "user") {
        const authTotal = await Authorization.countDocuments(
          { company: user.companyId }
        );
        const users = await Authorization.find({
          company: user.companyId,
        }).populate({ path: "page", model: Pages });
        return NextResponse.json(
          {
            ...message200,
            data: [...users],
            totalItems: authTotal,
          },
          { status: 200, statusText: message200.message }
        );
      } else {
        const jwtSuperAdmin = jwt.verify(
          token.split(" ")[1],
          jwtKey
        ) as ISuperAdminJWT;
        if (jwtSuperAdmin.role === "superadmin") {
          const authTotal = await Authorization.countDocuments();
          const findUser = await Authorization.find().populate({
            path: "page",
            model: Pages,
          });

          return NextResponse.json(
            {
              ...message200,
              data: [...findUser],
              totalItems: authTotal,
            },
            { status: 200 }
          );
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
