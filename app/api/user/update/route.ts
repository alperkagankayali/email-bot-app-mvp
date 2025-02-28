import connectToDatabase from "@/lib/mongoose";
import User from "@/models/user";
import { NextResponse } from "next/server";
const bcrypt = require("bcryptjs");
import jwt from "jsonwebtoken";
import { IUserJWT, ISuperAdminJWT } from "../login/route";
import { message201, message401, message403, message500 } from "@/constants";
import { v4 as uuidv4 } from "uuid";
import Company from "@/models/company";
import { verifyToken } from "@/lib/jwt";

export async function POST(request: Request) {
  try {
    await connectToDatabase();
    const token = request.headers.get("authorization"); // API anahtarı kontrolü
    const jwtKey: string = process.env.JWT_SCREET_KEY as string;
    const { id, updateData } = await request.json();
    if (!!token) {
      const verificationResult: any = await verifyToken(token.split(" ")[1]);
      if (verificationResult instanceof NextResponse) {
        return verificationResult; // 401 döndürecek
      } else {
        const user = jwt.verify(token.split(" ")[1], jwtKey) as IUserJWT;
        if (user.role === "admin") {
          const findCompany = await Company.findOne({
            _id: verificationResult.companyId,
          });
          const some = findCompany.emailDomainAddress?.includes(
            updateData?.email?.split("@")[1]
          );
          if (!some) {
            return NextResponse.json(
              {
                ...message403,
              },
              { status: 403 }
            );
          } else {
            const user = await User.findOneAndUpdate(
              { _id: id },
              { $set: updateData },
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
          }
        } else {
          const jwtSuperAdmin = jwt.verify(
            token.split(" ")[1],
            jwtKey
          ) as ISuperAdminJWT;
          if (jwtSuperAdmin.role === "superadmin") {
            const findCompany = await Company.findOne({
              _id: updateData.company,
            });
            const some = findCompany?.emailDomainAddress?.includes(
              updateData?.email?.split("@")[1]
            );
            if (!some) {
              return NextResponse.json(
                {
                  ...message403,
                  message: "email adresleri şirketinizde ekli değil",
                },
                { status: 403 }
              );
            }
            const user = await User.findOneAndUpdate(
              { _id: id },
              { $set: updateData },
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
          }
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
