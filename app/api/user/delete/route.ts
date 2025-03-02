import connectToDatabase from "@/lib/mongoose";
import User from "@/models/user";
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { IUserJWT, ISuperAdminJWT } from "../login/route";
import { message201, message401, message500 } from "@/constants";
import { verifyToken } from "@/lib/jwt";

export async function POST(request: Request) {
  try {
    await connectToDatabase();
    const token = request.headers.get("authorization"); // API anahtarı kontrolü
    const jwtKey: string = process.env.JWT_SCREET_KEY as string;
    const { id } = await request.json();
    if (!!token) {
      const verificationResult: any = await verifyToken(token.split(" ")[1]);
      if (verificationResult instanceof NextResponse) {
        return verificationResult; // 401 döndürecek
      } else {
        const user = jwt.verify(token.split(" ")[1], jwtKey) as IUserJWT;
        const jwtSuperAdmin = jwt.verify(
          token.split(" ")[1],
          jwtKey
        ) as ISuperAdminJWT;
        if (user.role === "admin" || jwtSuperAdmin.role === "superadmin") {
          const user = await User.findOneAndUpdate(
            { _id: id },
            { $set: { isDelete: true } },
            { new: true }
          );
          const userUpdated = await user.save();
          return NextResponse.json(
            {
              ...message201,
              data: userUpdated,
            },
            { status: 201 }
          );
        } else {
          return NextResponse.json(
            {
              ...message401,
            },
            { status: 401 }
          );
        }
      }
    } else {
      return NextResponse.json(
        {
          ...message401,
        },
        { status: 403 }
      );
    }
  } catch (error: any) {
    if (error.code === 11000) {
      return NextResponse.json(
        {
          ...message500,
          message: "Bu email adresiyle zaten bir kullanıcı var",
        },
        { status: 500 }
      );
    }
    return NextResponse.json({ ...message500 }, { status: 500 });
  }
}
