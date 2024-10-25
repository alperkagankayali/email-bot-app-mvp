import connectToDatabase from "@/lib/mongoose";
import Admin from "@/models/admin";
import User from "@/models/user";
import { NextResponse } from "next/server";
export const dynamic = "force-dynamic"; // <- add this to force dynamic render
import jwt from "jsonwebtoken";
import { IJWT } from "../login/route";

export async function GET(request: Request) {
  try {
    await connectToDatabase();
    const token = request.headers.get("authorization"); // API anahtarı kontrolü
    const jwtKey: string = process.env.JWT_SCREET_KEY as string;
    if (!!token) {
      const user = jwt.verify(token.split(" ")[1], jwtKey) as IJWT;
      if (user.role === "superadmin") {
        const adminTotal = await Admin.countDocuments();
        const userTotal = await User.countDocuments();
        const admin = await Admin.find({});
        const users = await User.find({});
        return NextResponse.json({
          message: "Success data.",
          color: "success",
          status: 200,
          data: [...users, ...admin],
          totalItems: userTotal + adminTotal,
        });
      } else if (user.role === "admin") {
        const userTotal = await User.countDocuments(
          {},
          { relationWithAdmin: user.id }
        );
        const findUser = await User.find({ relationWithAdmin: user.id });
        return NextResponse.json({
          message: "Success data.",
          color: "success",
          status: 200,
          data: [...findUser],
          totalItems: userTotal,
        },{ status: 200 });
      }
    } else {
      return NextResponse.json({
        data: null,
        status: 401,
        message: "User information error. Authentication failed.",
        color: "danger",
      },{ status: 401 });
    }
  } catch (error) {
    console.error("Hata:", error);
    return NextResponse.json(
      { success: false, message: "Bir hata oluştu" },
      { status: 500 }
    );
  }
}
