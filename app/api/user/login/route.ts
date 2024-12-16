import connectToDatabase from "@/lib/mongoose";
import User from "@/models/user";
import { IUser } from "@/types/userType";
import { NextResponse } from "next/server";
const bcrypt = require("bcryptjs");
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import { ISuperAdmin } from "@/types/superAdmingType";
import SuperAdmin from "@/models/superAdmin";
import { cookiesOpt, message200, message403, message500 } from "@/constants";
import Company from "@/models/company";
const { createCodec } = require("json-crypto");
export interface IUserJWT {
  email: string;
  password: string;
  id: string;
  department: string;
  language: string;
  nameSurname: string;
  role: "user" | "admin";
  companyName: string;
  companyId: string;
  lisanceStartDate: Date;
  lisanceEndDate: Date;
  companyLogo: string;
}

export interface ISuperAdminJWT {
  email: string;
  id: string;
  language: string;
  nameSurname: string;
  role: "superadmin";
}

export async function POST(request: Request) {
  try {
    await connectToDatabase();
    const body = await request.json();
    let superAdmin: ISuperAdmin | null = await SuperAdmin.findOne({
      email: body.email,
    });
    const newDate = new Date();
    let user: IUser | null = await User.findOne({ email: body.email }).populate(
      { path: "company", model: Company }
    );
    const jwtKey: string = process.env.JWT_SCREET_KEY as string;
    const cookieKey: string = process.env.COOKIE_SCREET_KEY as string;

    //lissans süresine bakacağız ona göre login edeceğiz

    if (
      superAdmin !== null &&
      bcrypt.compareSync(body.password, superAdmin.password)
    ) {
      const codec = createCodec(cookieKey);
      const token = jwt.sign(
        {
          email: superAdmin?.email,
          id: superAdmin?._id,
          role: "superadmin",
          language: superAdmin.language,
          nameSurname: superAdmin.nameSurname,
        },
        jwtKey,
        { expiresIn: "10d" }
      );
      const userSesion = { isLoggedIn: true, token, ...user };
      const encryptedSessionData = codec.encrypt(userSesion); // Encrypt your session data
      cookies().set("currentUser", encryptedSessionData, cookiesOpt);

      return NextResponse.json(
        {
          ...message200,
          data: { token: token, type: "Bearer", user: superAdmin },
        },
        { status: 200 }
      );
    } else if (
      user !== null &&
      !user.isDelete &&
      bcrypt.compareSync(body.password, user.password)
    ) {
      const codec = createCodec(cookieKey);
      const token = jwt.sign(
        {
          email: user?.email,
          password: user?.password,
          id: user?._id,
          department: user.department,
          language: user.language,
          nameSurname: user.nameSurname,
          role: user.role,
          companyName: user?.company?.companyName,
          companyId: user?.company?._id,
          lisanceStartDate: user?.company?.lisanceStartDate,
          lisanceEndDate: user?.company?.lisanceEndDate,
          companyLogo: user?.company?.logo,
        },
        jwtKey,
        { expiresIn: "2h" }
      );
      const userSesion = { isLoggedIn: true, token, ...user };
      const encryptedSessionData = codec.encrypt(userSesion); // Encrypt your session data
      cookies().set("currentUser", encryptedSessionData, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 60 * 60 * 24 * 7, // One week
        path: "/",
      });

      return NextResponse.json(
        {
          ...message200,
          data: {
            token: token,
            type: "Bearer",
            user: {
              email: user?.email,
              password: user?.password,
              id: user?._id,
              department: user.department,
              language: user.language,
              nameSurname: user.nameSurname,
              role: user.role,
              companyName: user?.company?.companyName,
              companyId: user?.company?._id,
              lisanceStartDate: user?.company?.lisanceStartDate,
              lisanceEndDate: user?.company?.lisanceEndDate,
              companyLogo: user?.company?.logo,
            },
          },
        },
        { status: 200 }
      );
    } else {
      return NextResponse.json(
        {
          ...message403,
        },
        { status: 403 }
      );
    }
  } catch (error: any) {
    return NextResponse.json(
      { ...message500 },
      { status: 500, statusText: error?.message || "" }
    );
  }
}
