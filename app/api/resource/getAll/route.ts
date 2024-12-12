import connectToDatabase from "@/lib/mongoose";
import Resources from "@/models/resources";
import { NextResponse } from "next/server";
export const dynamic = "force-dynamic"; // <- add this to force dynamic render

export async function GET(request: Request) {
  try {
    await connectToDatabase();
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1"); // Varsayılan 1. sayfa
    const key = searchParams.get("key") || "";
    const language = searchParams.get("language") || "";
    const value = searchParams.get("value") || "";
    const limit = parseInt(searchParams.get("limit") || "10"); // Varsayılan limit 10
    const skip = (page - 1) * limit; //
    let filter: any = {};
    if (language) filter.code = language;
    if (key) filter.key = { $regex: key, $options: "i" }; // Büyük/küçük harf duyarsızlık için `i` ekledik
    if (value) filter.value = { $regex: value, $options: "i" };

    const total = await Resources.countDocuments(filter);
    const resources = await Resources.find(filter)
      .sort({
        created_at: "asc",
      })
      .skip(skip)
      .limit(limit);
    return NextResponse.json({
      success: true,
      message: "Veri başarıyla alındı",
      data: resources,
      pagination: {
        totalPages: Math.ceil(total / limit),
        currentPage: page,
        totalItems: total,
        perPage: limit,
      },
    });
  } catch (error) {
    console.error("Hata:", error);
    return NextResponse.json(
      { success: false, message: "Bir hata oluştu" },
      { status: 500 }
    );
  }
}
