import connectToDatabase from "@/lib/mongoose";
import { NextResponse } from "next/server";
export const dynamic = "force-dynamic";
import { message200, message401, message500 } from "@/constants";
import { verifyToken } from "@/lib/jwt";
import Article from "@/models/article";
import { Types } from "mongoose";

export async function GET(request: Request) {
  try {
    await connectToDatabase();
    const { searchParams } = new URL(request.url);
    const token = request.headers.get("authorization"); // API anahtarı kontrolü
    const page = parseInt(searchParams.get("page") || "1"); // Varsayılan 1. sayfa
    const limit = parseInt(searchParams.get("limit") || "50"); // Varsayılan limit 10
    const skip = (page - 1) * limit; //
    const id = searchParams.get("id");
    const authorType = searchParams.get("authorType");
    const language = searchParams.get("language");
    const name = searchParams.get("name");
    const orderId = searchParams.get("orderId");

    if (!!token) {
      const verificationResult: any = await verifyToken(token.split(" ")[1]);
      if (verificationResult instanceof NextResponse) {
        return verificationResult; // 401 döndürecek
      } else if (
        verificationResult?.role === "admin" ||
        verificationResult?.role === "superadmin"
      ) {
        if (!!id) {
          const article = await Article.findById(id);
          return NextResponse.json(
            {
              ...message200,
              data: article,
              totalItems: 1,
            },
            { status: 200, statusText: message200.message }
          );
        } else {
          const filter: any = {};
          if (!!authorType) {
            if (authorType.split("&").length > 1) {
              filter["$or"] = [
                { company: verificationResult?.companyId },
                { authorType: authorType.split("&") },
              ];
            } else {
              filter.authorType = authorType;
            }
          } else if (verificationResult?.role !== "superadmin") {
            filter["$or"] = [
              { company: verificationResult?.companyId },
              { authorType: "superadmin" },
            ];
          }
          filter.isDelete = false;
          !!language && (filter.language = language);
          !!name && (filter.title = { $regex: name, $options: "i" });
          let orderObjectId = null;
          let articleList = [];
          let total = await Article.countDocuments(filter);
          if (orderId && Types.ObjectId.isValid(orderId) && page === 1) {
            orderObjectId = new Types.ObjectId(orderId);
            const firstItems = await Article.findById(orderObjectId);
            articleList.push(firstItems.toObject());
            filter._id = { $nin: orderId }; // orderId'leri diğer listeden hariç tut
          }
          const articlFind = await Article.find(filter)
            .skip(skip)
            .limit(limit - articleList.length) // orderId varsa limitten düş
            .sort({ created_at: -1 });

          articleList = [...articleList, ...articlFind];

          return NextResponse.json(
            {
              ...message200,
              data: articleList,
              totalItems: total,
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
