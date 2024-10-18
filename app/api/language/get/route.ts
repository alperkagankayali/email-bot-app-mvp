import connectToDatabase from "@/lib/mongoose";
import Languages from "@/models/languages";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  try {
    await connectToDatabase();
    const languages = await Languages.find({ isActive: true }).sort({
      created_at: -1,
    });

    return NextResponse.json({
      success: true,
      message: "Veri başarıyla alındı",
      languages,
    });
  } catch (error) {
    console.error("Hata:", error);
    return NextResponse.json(
      { success: false, message: "Bir hata oluştu" },
      { status: 500 }
    );
  }
}
