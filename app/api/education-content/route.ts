import connectToDatabase from "@/lib/mongoose";
import { NextResponse } from "next/server";
export const dynamic = "force-dynamic";
import { message200, message401, message500 } from "@/constants";
import { verifyToken } from "@/lib/jwt";
import Course from "@/models/course";
import Company from "@/models/company";
import User from "@/models/user";
import Article from "@/models/article";
import Video from "@/models/video";
import Quiz from "@/models/quiz";

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
          if (verificationResult?.role === "superadmin") {
            const courseTotal = await Course.countDocuments({
              isDelete: false,
            });

            const courses = await Course.find({
              isDelete: false,
            })
              .select("title description img isPublished contents")
              .skip(skip)
              .limit(limit);
            return NextResponse.json(
              {
                ...message200,
                data: courses,
                totalItems: courseTotal,
              },
              { status: 200, statusText: message200.message }
            );
          }
          const courseTotal = await Course.countDocuments({
            isDelete: false,
            $or: [
              { company: verificationResult.companyId },
              { authorType: "superadmin" },
            ],
          });

          const courses = await Course.find({
            isDelete: false,
            $or: [
              { company: verificationResult.companyId },
              { authorType: "superadmin" },
            ],
          })
            .select("title description img isPublished contents")
            .skip(skip)
            .limit(limit);
          return NextResponse.json(
            {
              ...message200,
              data: courses,
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
