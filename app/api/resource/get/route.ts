import connectToDatabase from "@/lib/mongoose";
import Resources from "@/models/resources";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  try {
    await connectToDatabase();
    const { searchParams } = new URL(request.url);
    const code = searchParams.get("code");
    const languages = await Resources.find({ code: code });

    const responseData = languages.reduce((acc, item) => {
      const itemObject = item.toObject();
      Object.entries(itemObject).forEach(([key, value]) => {
        if (!['_id', '__v','code'].includes(key)) { // Sabit alanları hariç tut
          acc[key] = value; // Anahtar-değer çiftlerini birleştir
        }
      });
      return acc;
    }, {}); // Başlangıç nesnesi boş bir object
    return NextResponse.json({
      success: true,
      message: "Veri başarıyla alındı",
      data: { pages: responseData },
    });
  } catch (error) {
    console.error("Hata:", error);
    return NextResponse.json(
      { success: false, message: "Bir hata oluştu" },
      { status: 500 }
    );
  }
}
