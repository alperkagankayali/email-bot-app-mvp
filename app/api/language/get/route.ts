import connectToDatabase from "@/lib/mongoose";
import Languages from "@/models/languages";
import { NextResponse } from "next/server";
export const dynamic = 'force-dynamic'; // <- add this to force dynamic render

export async function GET(request: Request) {
  try {
    await connectToDatabase();
    const { searchParams } = new URL(request.url);
    const isActive = searchParams.get("isActive"); // Varsayılan 1. sayfa
    const page = parseInt(searchParams.get("page") || "1"); // Varsayılan 1. sayfa
    const limit = parseInt(searchParams.get("limit") || "10"); // Varsayılan limit 10
    const skip = (page - 1) * limit; //
    const total = await Languages.countDocuments();
    const languages = await Languages.find(
      !!isActive && JSON.parse(isActive || "") 
        ? { isActive: true }
        : {}
    )
      .sort({
        name: "asc",
      })
      .skip(skip)
      .limit(limit);

    return NextResponse.json({
      message: "Success data.",
      color: "success",
      status: 200,
      data: languages,
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
