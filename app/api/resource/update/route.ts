import connectToDatabase from "@/lib/mongoose";
import Resource from "@/models/resources";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    await connectToDatabase();
    const { id, updateData } = await request.json();

    const updateLanguage = await Resource.findOneAndUpdate(
      { _id: id }, // Güncellenecek kaydı bulmak için filtre
      { $set: updateData }, // Güncellenecek veriler
      { new: true } // Güncellenmiş veriyi döndür
    );

    return NextResponse.json({
      success: true,
      message: "Veri başarıyla alındı",
      data: updateLanguage,
    });
  } catch (error) {
    console.error("Hata:", error);
    return NextResponse.json(
      { success: false, message: "Bir hata oluştu" },
      { status: 500 }
    );
  }
}
