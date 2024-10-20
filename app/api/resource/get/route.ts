import connectToDatabase from "@/lib/mongoose";
import Resources from "@/models/resources";
import { NextResponse } from "next/server";
export const dynamic = "force-dynamic"; // <- add this to force dynamic render

export async function GET(request: Request) {
  try {
    await connectToDatabase();
    const { searchParams } = new URL(request.url);
    const code = searchParams.get("code");
    const languages = await Resources.find({ code: code });

    const result: any = {};

    languages.forEach((item: any) => {
      result[item.key] = item.value;
    });
    return NextResponse.json({
      success: true,
      message: "Veri başarıyla alındı",
      data: { pages: result },
    });
  } catch (error) {
    console.error("Hata:", error);
    return NextResponse.json(
      { success: false, message: "Bir hata oluştu" },
      { status: 500 }
    );
  }
}
