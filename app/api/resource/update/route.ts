import connectToDatabase from "@/lib/mongoose";
import Resource from "@/models/resources";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    await connectToDatabase();
    const { id, key, value } = await request.json();
    const findResource = await Resource.find({ _id: id });
    const responseData = findResource.reduce((acc: any, item: any) => {
      const itemObject = item.toObject();
      Object.entries(itemObject).forEach(async ([key, value]) => {
        if (!["_id", "__v", "code"].includes(key)) {
          // Sabit alanları hariç tut
          acc[key] = value; // Anahtar-değer çiftlerini birleştir
          const updateLanguage = await Resource.findOneAndUpdate(
            { _id: id }, // Güncellenecek kaydı bulmak için filtre
            {
              $set: { [key]: "$Username" }, // Username alanının değerini username'e aktar
              $unset: { Username: "" }, // Username alanını sil
            },
            { new: true } // Güncellenmiş veriyi döndür
          );
        }
      });
      return acc;
    }, {});
    // const updateLanguage = await Resource.findOneAndUpdate(
    //   { _id: id }, // Güncellenecek kaydı bulmak için filtre
    //   { $set: { [key]: value } }, // Dinamik key-value doğrudan belgeye ekleniyor
    //   { new: true } // Güncellenmiş veriyi döndür
    // );

    return NextResponse.json({
      success: true,
      message: "Veri başarıyla alındı",
      data: responseData,
    });
  } catch (error) {
    console.error("Hata:", error);
    return NextResponse.json(
      { success: false, message: "Bir hata oluştu" },
      { status: 500 }
    );
  }
}
