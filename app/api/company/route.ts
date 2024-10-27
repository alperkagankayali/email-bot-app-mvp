import { message200, message401, message500 } from "@/constants";
import connectToDatabase from "@/lib/mongoose";
import User from "@/models/user";
import { ISuperAdmin } from "@/types/superAdmingType";
import { NextResponse } from "next/server";
const bcrypt = require("bcryptjs");
import jwt from "jsonwebtoken";
import Company from "@/models/company";

export async function GET(request: Request) {
  try {
    await connectToDatabase();
    const token = request.headers.get("authorization"); // API anahtarı kontrolü
    const jwtKey: string = process.env.JWT_SCREET_KEY as string;
    if (!!token) {
      const user = jwt.verify(token.split(" ")[1], jwtKey) as ISuperAdmin;
      if (user.role === "superadmin") {
        const companyTotal = await Company.countDocuments();
        const findCompany = await Company.find();
        return NextResponse.json(
          {
            ...message200,
            data: [...findCompany],
            totalItems: companyTotal,
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
