import connectToDatabase from "@/lib/mongoose";
import User from "@/models/user";
import { NextResponse } from "next/server";
const bcrypt = require("bcryptjs");

export async function POST(request: Request) {
  try {
    await connectToDatabase();
    const body = await request.json();
    const passwordHash = bcrypt.hashSync(body.password, 10);
    const resourceCreate = new User({
      ...body,
      password: passwordHash,
    });
    const resourceCreated = await resourceCreate.save();
    return NextResponse.json({
      success: true,
      message: "Veri başarıyla alındı",
      resourceCreated,
    });
  } catch (error) {
    console.error("Hata:", error);
    return NextResponse.json(
      { success: false, message: "Bir hata oluştu" },
      { status: 500 }
    );
  }
}
