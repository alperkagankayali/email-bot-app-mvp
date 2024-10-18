import connectToDatabase from "@/lib/mongoose";
import Languages from "@/models/languages";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    await connectToDatabase();
    const body = await request.json();
    const language = new Languages({
      ...body,
    });
    const languageCreated = await language.save();
    return NextResponse.json({
      success: true,
      message: "Veri başarıyla alındı",
      languageCreated,
    });
  } catch (error) {
    console.error("Hata:", error);
    return NextResponse.json(
      { success: false, message: "Bir hata oluştu" },
      { status: 500 }
    );
  }
}
