import connectToDatabase from "@/lib/mongoose";
import { NextResponse } from "next/server";
export const dynamic = "force-dynamic";
import { message201, message401, message404, message500 } from "@/constants";
import { verifyToken } from "@/lib/jwt";
import Article from "@/models/article";

export async function POST(request: Request) {
  try {
    await connectToDatabase();
    const { id, updateData } = await request.json();
    const token = request.headers.get("authorization"); // API anahtarı kontrolü
    if (!!token) {
      const verificationResult: any = await verifyToken(token.split(" ")[1]);
      if (verificationResult instanceof NextResponse) {
        return verificationResult; // 401 döndürecek
      } else if (
        verificationResult?.role === "admin" ||
        verificationResult?.role === "superadmin"
      ) {
        const findArticle = await Article.findById(id);
        if (!findArticle) {
          return NextResponse.json(
            {
              ...message404,
              message: "Article not found",
            },
            { status: 404 }
          );
        } else if (
          verificationResult?.role === "admin" &&
          findArticle.authorType === "superadmin"
        ) {
          const newArticle = new Article({
            ...findArticle.toObject(),
            ...updateData,
            created_at: Date.now(),
            _id: undefined,
            authorType: "User",
            author: verificationResult.id,
            company: verificationResult?.companyId,
          });

          await newArticle.save();

          return NextResponse.json(
            {
              ...message201,
              data: newArticle,
            },
            { status: 201 }
          );
        } else {
          const article = await Article.findOneAndUpdate(
            { _id: id },
            { $set: updateData },
            { new: true }
          );
          return NextResponse.json(
            {
              ...message201,
              data: article,
            },
            { status: 201, statusText: message201.message }
          );
        }
      } else {
        return NextResponse.json(
          {
            ...message401,
          },
          { status: 401, statusText: message401.message }
        );
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
