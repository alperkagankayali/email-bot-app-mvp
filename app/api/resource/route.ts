import connectToDatabase from "@/lib/mongoose";
import Resources from "@/models/resources";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    await connectToDatabase();
    const body = await request.json();
    const resourceCreated = await Resources.insertMany(body);

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
