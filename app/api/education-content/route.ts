import connectToDatabase from "@/lib/mongoose";
import { NextResponse } from "next/server";
export const dynamic = "force-dynamic";
import { message200, message401, message500 } from "@/constants";
import { verifyToken } from "@/lib/jwt";
import Course from "@/models/course";

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
      } else if (verificationResult?.role === "admin") {
        if (!!id) {
          const course = await Course.findById(id);
          return NextResponse.json(
            {
              ...message200,
              data: course,
              totalItems: 1,
            },
            { status: 200, statusText: message200.message }
          );
        } else {
          const courseTotal = await Course.countDocuments({
            isDelete: false,
          });
          const course = await Course.find({ isDelete: false })
            .skip(skip)
            .limit(limit);
          return NextResponse.json(
            {
              ...message200,
              data: course,
              totalItems: courseTotal,
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
