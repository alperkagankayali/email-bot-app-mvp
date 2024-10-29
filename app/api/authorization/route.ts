import { message201, message401, message500 } from "@/constants";
import connectToDatabase from "@/lib/mongoose";
import { ISuperAdmin } from "@/types/superAdmingType";
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import Authorization from "@/models/authorization";

export async function POST(request: Request) {
  try {
    await connectToDatabase();
    const body = await request.json();
    const token = request.headers.get("authorization"); // API anahtarı kontrolü
    const jwtKey: string = process.env.JWT_SCREET_KEY as string;
    if (!!token) {
      const user = jwt.verify(token.split(" ")[1], jwtKey) as ISuperAdmin;
      if (user.role === "superadmin") {
        const authCreate = new Authorization({
          ...body,
        });
        const auth = await authCreate.save();
        return NextResponse.json(
          {
            ...message201,
            data: auth,
          },
          { status: 201 }
        );
      } else if (user.role === "admin") {
        const authCreate = new Authorization({
          ...body,
        });
        const auth = await authCreate.save();
        return NextResponse.json(
          {
            ...message201,
            data: auth,
          },
          { status: 201 }
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
