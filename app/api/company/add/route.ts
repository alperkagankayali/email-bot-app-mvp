import { message200, message201, message401, message500 } from "@/constants";
import connectToDatabase from "@/lib/mongoose";
import { ISuperAdmin } from "@/types/superAdmingType";
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import Company from "@/models/company";
import { ISuperAdminJWT } from "../../user/login/route";
import { verifyToken } from "@/lib/jwt";

export async function POST(request: Request) {
  try {
    await connectToDatabase();
    const body = await request.json();
    const token = request.headers.get("authorization"); // API anahtarı kontrolü
    const jwtKey: string = process.env.JWT_SCREET_KEY as string;
    if (!!token) {
      const user = jwt.verify(token.split(" ")[1], jwtKey) as ISuperAdmin;
      const verificationResult: ISuperAdminJWT | any = await verifyToken(
        token.split(" ")[1]
      );
      if (verificationResult instanceof NextResponse) {
        return verificationResult; // 401 döndürecek
      } else {
        if (user.role === "superadmin") {
          const company = new Company({
            ...body,
          });
          const companyCreated = await company.save();
          return NextResponse.json(
            {
              ...message201,
              author: user._id,
              data: companyCreated,
            },
            { status: 201, statusText: message201.message }
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
