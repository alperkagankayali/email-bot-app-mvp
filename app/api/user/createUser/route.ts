import connectToDatabase from "@/lib/mongoose";
import User from "@/models/user";
import { NextResponse } from "next/server";
const bcrypt = require("bcryptjs");
import jwt from "jsonwebtoken";
import { IJWT } from "../login/route";

export async function POST(request: Request) {
  try {
    await connectToDatabase();
    const body = await request.json();
    const token = request.headers.get("authorization"); // API anahtarı kontrolü
    const jwtKey: string = process.env.JWT_SCREET_KEY as string;
    if (!!token) {
      const user = jwt.verify(token.split(" ")[1], jwtKey) as IJWT;
      if (user.role === "admin" || user.role === "superadmin") {
        const passwordHash = bcrypt.hashSync(body.password, 10);
        const userCreate = new User({
          ...body,
          relationWithAdmin: user.id,
          password: passwordHash,
        });
        const userCreated = await userCreate.save();
        return NextResponse.json({
          success: true,
          message: "Veri başarıyla alındı",
          userCreated,
        });
      } else {
        return NextResponse.json({
          data: null,
          status: 401,
          message: "User information error. Authentication failed.",
          color: "danger",
        });
      }
    } else {
      return NextResponse.json({
        data: null,
        status: 404,
        message: "User information error. Authentication failed.",
        color: "danger",
      });
    }
  } catch (error) {
    console.error("Hata:", error);
    return NextResponse.json(
      { success: false, message: "Bir hata oluştu" },
      { status: 500 }
    );
  }
}
