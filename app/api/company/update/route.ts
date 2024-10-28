import { message200,  message401, message500 } from "@/constants";
import connectToDatabase from "@/lib/mongoose";
import { ISuperAdmin } from "@/types/superAdmingType";
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import Company from "@/models/company";

export async function POST(request: Request) {
  try {
    await connectToDatabase();
    const { id, updateData } = await request.json();
    const token = request.headers.get("authorization"); // API anahtarı kontrolü
    const jwtKey: string = process.env.JWT_SCREET_KEY as string;
    if (!!token) {
      const user = jwt.verify(token.split(" ")[1], jwtKey) as ISuperAdmin;
      if (user.role === "superadmin") {
        const updateCompany = await Company.findOneAndUpdate(
          { _id: id }, // Güncellenecek kaydı bulmak için filtre
          { $set: updateData }, // Güncellenecek veriler
          { new: true } // Güncellenmiş veriyi döndür
        );
        return NextResponse.json(
          {
            ...message200,
            author: user._id,
            data: updateCompany,
          },
          { status: 200, statusText: message200.message }
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
