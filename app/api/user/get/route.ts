import connectToDatabase from "@/lib/mongoose";
import User from "@/models/user";
import { NextResponse } from "next/server";
export const dynamic = "force-dynamic"; // <- add this to force dynamic render
import jwt from "jsonwebtoken";
import { ISuperAdminJWT, IUserJWT } from "../login/route";
import { message200, message401, message500 } from "@/constants";
import Company from "@/models/company";
import { Types } from "mongoose";
export async function GET(request: Request) {
  try {
    await connectToDatabase();
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    const authorType = searchParams.get("authorType");
    const isSelectUser = JSON.parse(
      searchParams.get("isSelectUser") ?? "false"
    );
    const token = request.headers.get("authorization"); // API anahtarı kontrolü
    const jwtKey: string = process.env.JWT_SCREET_KEY as string;
    if (!!token) {
      const jwtSuperAdmin = jwt.verify(token.split(" ")[1], jwtKey) as
        | ISuperAdminJWT
        | IUserJWT;
      if (
        (jwtSuperAdmin.role === "superadmin" ||
          jwtSuperAdmin.role === "admin") &&
        !!id && !isSelectUser
      ) {
        const userTotal = await User.countDocuments({
          company: id,
        });
        const files = await User.find({
          company: id,
        }).populate({
          path: "company",
          model: Company,
        });
        return NextResponse.json(
          {
            ...message200,
            data: files,
            totalItems: userTotal,
          },
          { status: 200 }
        );
      } else if (
        (jwtSuperAdmin.role === "superadmin" ||
          jwtSuperAdmin.role === "admin") &&
        !!id &&
        isSelectUser
      ) {
        const userTotal = await User.countDocuments({
          company: id,
          role: { $ne: authorType },
        });
        const files = await User.find({
          company: id,
          role: { $ne: authorType },
        }).populate({
          path: "company",
          model: Company,
        });
        const groupedUsers = await User.aggregate([
          {
            $match: {
              company: new Types.ObjectId(id),
              role: { $ne: authorType }, // admin rolünü hariç tut
            },
          },
          {
            $group: {
              _id: "$department", // Department alanına göre grupla
              // name: "$department",
              users: {
                $push: {
                  _id: "$_id",
                  nameSurname: "$nameSurname",
                  email: "$email",
                  language: "$language",
                  company: "$company",
                  role: "$role",
                  createdAt: "$createdAt",
                },
              },
            },
          },
          {
            $sort: { _id: 1 }, // Department adlarına göre sıralama
          },
        ]);
        return NextResponse.json(
          {
            ...message200,
            data: files,
            department: groupedUsers,
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
