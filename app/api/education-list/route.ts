import connectToDatabase from "@/lib/mongoose";
import { NextResponse } from "next/server";
export const dynamic = "force-dynamic";
import { message200, message401, message500 } from "@/constants";
import { verifyToken } from "@/lib/jwt";
import EducationList from "@/models/educationList";
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
    const language = searchParams.get("language");

    if (!!token) {
      const verificationResult: any = await verifyToken(token.split(" ")[1]);
      if (verificationResult instanceof NextResponse) {
        return verificationResult; // 401 döndürecek
      } else if (
        verificationResult?.role === "admin" ||
        verificationResult?.role === "superadmin"
      ) {
        if (!!id) {
          const education = await EducationList.findById(id).populate({
            path: "educations",
            model: Course,
          });
          return NextResponse.json(
            {
              ...message200,
              data: education,
              totalItems: 1,
            },
            { status: 200 }
          );
        } else {
          if (verificationResult?.role === "superadmin") {
            const educationTotal = await EducationList.countDocuments({
              isDelete: false,
            });
            const education = await EducationList.find({
              isDelete: false,
            })
              .populate({
                path: "educations", // `educations` Course tablosuna referans içeriyor
                match: {
                  isDelete: false, // Course tablosundan sadece silinmemiş belgeler
                  // language: { $in: language }, // Belirtilen dillerle eşleşen belgeler
                  $or: [
                    { language: { $in: language } }, // Belirtilen diller
                    { language: { $exists: true } }, // Eğer belirtilen diller yoksa herhangi bir dil
                  ],
                },
                select:
                  "title description author isPublished contents language", // Sadece gerekli alanlar
                model: Course,
              })
              .skip(skip)
              .limit(limit);
            return NextResponse.json(
              {
                ...message200,
                data: education,
                totalItems: educationTotal,
              },
              { status: 200 }
            );
          }
          const educationTotal = await EducationList.countDocuments({
            isDelete: false,
            $or: [
              { company: verificationResult.companyId },
              { authorType: "superadmin" },
            ],
          });
          const education = await EducationList.find({
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
              data: education,
              totalItems: educationTotal,
            },
            { status: 200 }
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
    return NextResponse.json({ ...message500 }, { status: 500 });
  }
}
