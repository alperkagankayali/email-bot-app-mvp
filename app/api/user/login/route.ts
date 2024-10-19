import connectToDatabase from "@/lib/mongoose";
import User from "@/models/user";
import { IUser } from "@/types/userType";
import { NextResponse } from "next/server";
const bcrypt = require("bcryptjs");
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
const { createKey, createCodec } = require("json-crypto");

export async function POST(request: Request) {
  try {
    await connectToDatabase();
    const body = await request.json();
    let user: IUser | null = await User.findOne({ email: body.email });
    const jwtKey: string = process.env.JWT_SCREET_KEY as string;
    const cookieKey: string = process.env.COOKIE_SCREET_KEY as string;

    if (user === null) {
      return NextResponse.json({
        data: null,
        status: 404,
        message: "User information error. Authentication failed.",
        color: "danger",
      });
    } else if (bcrypt.compareSync(body.password, user.password)) {
      const codec = createCodec(cookieKey);
      const token = jwt.sign(
        {
          ...user,
        },
        jwtKey,
        { expiresIn: "2h" }
      );

      const userSesion = { isLoggedIn: true, token, ...user };

      const encryptedSessionData = codec.encrypt(userSesion); // Encrypt your session data
      cookies().set("session", encryptedSessionData, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 60 * 60 * 24 * 7, // One week
        path: "/",
      });

      console.log(codec.decrypt(encryptedSessionData));
      return NextResponse.json({
        success: true,
        message: "Veri başarıyla alındı",
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
