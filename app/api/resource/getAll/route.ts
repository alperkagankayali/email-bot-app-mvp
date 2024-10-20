import connectToDatabase from "@/lib/mongoose";
import Resources from "@/models/resources";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  try {
    await connectToDatabase();
    const { searchParams } = new URL(request.url);
    const code = searchParams.get("code");
    const page = parseInt(searchParams.get("page") || "1"); // Varsayılan 1. sayfa
    const limit = parseInt(searchParams.get("limit") || "10"); // Varsayılan limit 10
    const skip = (page - 1) * limit; //
    const total = await Resources.countDocuments();
    const resources = await Resources.find(!!code ? { code: code } : {})
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
