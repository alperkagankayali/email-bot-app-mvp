import { message401 } from "@/constants";
import jwt from "jsonwebtoken";
import { NextResponse } from "next/server";

// JWT doğrulama işlevi
export async function verifyToken(token: string) {
  try {
    const jwtKey: string = process.env.JWT_SCREET_KEY as string;
    const decoded = jwt.verify(token, jwtKey);
    return decoded; 
  } catch (error: any) {
    if (error.name === "TokenExpiredError") {
      return NextResponse.json({ message401 }, { status: 401 });
    }
    return NextResponse.json({ message401 }, { status: 401 });
  }
}
