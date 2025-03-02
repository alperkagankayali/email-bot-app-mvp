import connectToDatabase from "@/lib/mongoose";
import User from "@/models/user";
import { NextResponse } from "next/server";
export const dynamic = "force-dynamic"; // <- add this to force dynamic render
import jwt from "jsonwebtoken";
import { ISuperAdminJWT, IUserJWT } from "../login/route";
import { message200, message401, message500 } from "@/constants";
import Company from "@/models/company";
import { verifyToken } from "@/lib/jwt";

export async function GET(request: Request) {
  try {
    await connectToDatabase();
    const { searchParams } = new URL(request.url);
    const token = request.headers.get("authorization"); // API anahtarı kontrolü
    const jwtKey: string = process.env.JWT_SCREET_KEY as string;
    const id = searchParams.get("id");
    const page = parseInt(searchParams.get("page") || "1"); // Varsayılan 1. sayfa
    const limit = parseInt(searchParams.get("limit") || "10"); // Varsayılan limit 10
    const skip = (page - 1) * limit; //
    if (!!token) {
      const verificationResult: any = await verifyToken(token.split(" ")[1]);
      if (verificationResult instanceof NextResponse) {
        return verificationResult; // 401 döndürecek
      } else {
        const user = jwt.verify(token.split(" ")[1], jwtKey) as IUserJWT;
        if (!!id) {
          const users = await User.findById(id)
            .populate({
              path: "company",
              model: Company,
            })
            .select(["department", "email", "language", "nameSurname", "role"]);
          return NextResponse.json(
            {
              ...message200,
              data: users,
            },
            { status: 200, statusText: message200.message }
          );
        } else if (user.role === "admin") {
          const userTotal = await User.countDocuments({
            company: user.companyId,
            isDelete: false,
          });
          const users = await User.find({
            company: user.companyId,
            isDelete: false,
          })
            .populate({
              path: "company",
              model: Company,
            })
            .skip(skip)
            .limit(limit)
            .sort({ role: 1 });
          return NextResponse.json(
            {
              ...message200,
              data: [...users],
              totalItems: userTotal,
            },
            { status: 200, statusText: message200.message }
          );
        } else {
          const jwtSuperAdmin = jwt.verify(
            token.split(" ")[1],
            jwtKey
          ) as ISuperAdminJWT;
          if (jwtSuperAdmin.role === "superadmin") {
            const userTotal = await User.countDocuments({ isDelete: false });
            const findUser = await User.find({ isDelete: false })
              .populate({
                path: "company",
                model: Company,
              })
              .sort({ role: 1 })
              .skip(skip)
              .limit(limit);

            return NextResponse.json(
              {
                ...message200,
                data: [...findUser],
                totalItems: userTotal,
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
