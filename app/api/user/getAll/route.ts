import connectToDatabase from "@/lib/mongoose";
import Admin from "@/models/admin";
import Languages from "@/models/languages";
import User from "@/models/user";
import { NextResponse } from "next/server";
export const dynamic = "force-dynamic"; // <- add this to force dynamic render

export async function GET(request: Request) {
  try {
    await connectToDatabase();

    const adminTotal = await Admin.countDocuments();
    const userTotal = await User.countDocuments();
    const users = await User.find({});
    const admin = await Admin.find({});

    return NextResponse.json({
      message: "Success data.",
      color: "success",
      status: 200,
      data: [...users, ...admin],
      totalItems: userTotal + adminTotal,
    });
  } catch (error) {
    console.error("Hata:", error);
    return NextResponse.json(
      { success: false, message: "Bir hata oluştu" },
      { status: 500 }
    );
  }
}
