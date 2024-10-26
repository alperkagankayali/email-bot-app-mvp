import connectToDatabase from "@/lib/mongoose";
import User from "@/models/user";
import { IUser } from "@/types/userType";
import { NextResponse } from "next/server";
const bcrypt = require("bcryptjs");
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import Admin from "@/models/admin";
import { IAdmin } from "@/types/adminType";
const { createCodec } = require("json-crypto");
export interface IJWT {
  email: string
  password: string
  id: string
  department: string
  language: string
  name: string
  lastName: string
  company?:string
  role: "user" | "admin" | "superadmin"
}

export async function POST(request: Request) {
  try {
    await connectToDatabase();
    const body = await request.json();
    let admin: IAdmin | null = await Admin.findOne({ email: body.email });
    let user: IUser | null = await User.findOne({ email: body.email });
    const jwtKey: string = process.env.JWT_SCREET_KEY as string;
    const cookieKey: string = process.env.COOKIE_SCREET_KEY as string;

    if (admin !== null && bcrypt.compareSync(body.password, admin.password)) {
      const codec = createCodec(cookieKey);
      const token = jwt.sign(
        {
          email: admin?.email,
          password: admin?.password,
          id: admin?._id,
          role: admin.userType,
          department: admin.department,
          language: admin.language,
          name: admin.name,
          lastName: admin.lastName,
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

      return NextResponse.json({
        message: "User information error. Authentication failed.",
        color: "danger",
        status: 200,
        data: { token: token, type: "Bearer", user: admin },
      });
    } else if (user !== null && bcrypt.compareSync(body.password, user.password)) {
      const codec = createCodec(cookieKey);
    
      const token = jwt.sign(
        {
          email: user?.email,
          password: user?.password,
          id: user?._id,
          department: user.department,
          language: user.language,
          name: user.name,
          lastName: user.lastName,
          role:"user",
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

      return NextResponse.json({
        message: "User information error. Authentication failed.",
        color: "success",
        status: 200,
        data: { token: token, type: "Bearer", user: user },
      });
    } else {
      return NextResponse.json({
        data: null,
        status: 403,
        message: "User information error. Authentication failed.",
        color: "danger",
      });
    }
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Bir hata oluştu" },
      { status: 500 }
    );
  }
}
