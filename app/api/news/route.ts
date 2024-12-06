import connectToDatabase from "@/lib/mongoose";
import { NextResponse } from "next/server";
export const dynamic = "force-dynamic";
import { message200, message401, message500 } from "@/constants";
import { verifyToken } from "@/lib/jwt";
import News from "@/models/news";

export async function GET(request: Request) {
  try {
    await connectToDatabase();
    const { searchParams } = new URL(request.url);
    const token = request.headers.get("authorization"); // API anahtarı kontrolü
    const page = parseInt(searchParams.get("page") || "1"); // Varsayılan 1. sayfa
    const limit = parseInt(searchParams.get("limit") || "50"); // Varsayılan limit 10
    const skip = (page - 1) * limit; //
    const id = searchParams.get("id");

    if (!!token) {
      const verificationResult: any = await verifyToken(token.split(" ")[1]);
      if (verificationResult instanceof NextResponse) {
        return verificationResult; // 401 döndürecek
      } else if (
        verificationResult?.role === "admin" ||
        verificationResult?.role === "superadmin"
      ) {
        if (!!id) {
          const news = await News.findById(id);
          return NextResponse.json(
            {
              ...message200,
              data: news,
              totalItems: 1,
            },
            { status: 200, statusText: message200.message }
          );
        } else {
          if (verificationResult?.role === "superadmin") {
            const newsTotal = await News.countDocuments({
              isDelete: false,
              $or: [
                { company: verificationResult.companyId },
                { authorType: "superadmin" },
              ],
            });
            const news = await News.find({
              isDelete: false,
              $or: [
                { company: verificationResult.companyId },
                { authorType: "superadmin" },
              ],
            })
              .skip(skip)
              .limit(limit);
            return NextResponse.json(
              {
                ...message200,
                data: news,
                totalItems: newsTotal,
              },
              { status: 200, statusText: message200.message }
            );
          }
          const newsTotal = await News.countDocuments({
            isDelete: false,
            $or: [
              { company: verificationResult.companyId },
              { authorType: "superadmin" },
            ],
          });
          const news = await News.find({
            isDelete: false,
            $or: [
              { company: verificationResult.companyId },
              { authorType: "superadmin" },
            ],
          })
            .skip(skip)
            .limit(limit);
          return NextResponse.json(
            {
              ...message200,
              data: news,
              totalItems: newsTotal,
            },
            { status: 200, statusText: message200.message }
          );
        }
      } else {
        return NextResponse.json(
          {
            ...message401,
          },
          { status: 401 }
        );
      }
    } else {
      return NextResponse.json(
        {
          ...message401,
        },
        { status: 401 }
      );
    }
  } catch (error: any) {
    return NextResponse.json(
      { ...message500 },
      { status: 500, statusText: error?.message || "" }
    );
  }
}
