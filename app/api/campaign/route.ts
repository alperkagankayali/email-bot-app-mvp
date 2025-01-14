import connectToDatabase from "@/lib/mongoose";
import { NextResponse } from "next/server";
export const dynamic = "force-dynamic";
import { message200, message401, message500 } from "@/constants";
import { verifyToken } from "@/lib/jwt";
import Campaign from "@/models/campaign";

export async function GET(request: Request) {
  try {
    await connectToDatabase();
    const { searchParams } = new URL(request.url);
    const token = request.headers.get("authorization"); // API anahtarı kontrolü
    const order = searchParams.get("order");
    const page = parseInt(searchParams.get("page") || "1"); // Varsayılan 1. sayfa
    const limit = parseInt(searchParams.get("limit") || "10"); // Varsayılan limit 10
    const skip = (page - 1) * limit; //
    const id = searchParams.get("id");

    if (!!token) {
      const verificationResult = await verifyToken(token.split(" ")[1]);
      if (verificationResult instanceof NextResponse) {
        return verificationResult; // 401 döndürecek
      } else {
        if (!!id) {
          const campaign = await Campaign.findById(id)
          // .populate({
          //   path: "scenarioType",
          //   select: "title", // Gerekli alanları seç
          // });

          return NextResponse.json(
            {
              ...message200,
              data: campaign,
              totalItems: 1,
            },
            { status: 200, statusText: message200.message }
          );
        } else {
          const compaingTotal = await Campaign.countDocuments({
            isDelete: false,
          });
          let compaing;
          if (!!order && order !== "default") {
            compaing = await Campaign.find({ isDelete: false })
              .sort({ [order]: -1 }) // Önce isActive'e göre, sonra created_at'e göre sırala
              .skip(skip)
              .limit(limit);
          } else {
            compaing = await Campaign.find({ isDelete: false })
              .sort({ isActive: -1, created_at: -1 }) // Önce isActive'e göre, sonra created_at'e göre sırala
              .skip(skip)
              .limit(limit);
          }

          return NextResponse.json(
            {
              ...message200,
              data: compaing,
              totalItems: compaingTotal,
            },
            { status: 200, statusText: message200.message }
          );
        }
      }
    } else {
      return NextResponse.json(
        {
          ...message401,
        },
        { status: 401, statusText: message401.message }
      );
    }
  } catch (error: any) {
    return NextResponse.json(
      { ...message500 },
      { status: 500, statusText: error?.message || "" }
    );
  }
}
