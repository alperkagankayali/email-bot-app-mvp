import connectToDatabase from "@/lib/mongoose";
import { NextResponse } from "next/server";
export const dynamic = "force-dynamic";
import { message201, message401, message500 } from "@/constants";
import { verifyToken } from "@/lib/jwt";
import EducationList from "@/models/educationList";
import Course from "@/models/course";

export async function POST(request: Request) {
  try {
    await connectToDatabase();
    const body = await request.json();
    const token = request.headers.get("authorization"); // API anahtarı kontrolü
    if (!!token) {
      const verificationResult: any = await verifyToken(token.split(" ")[1]);
      if (verificationResult instanceof NextResponse) {
        return verificationResult; // 401 döndürecek
      } else if (
        verificationResult?.role === "admin" ||
        verificationResult?.role === "superadmin"
      ) {
        const newEducationList = new EducationList({
          ...body,
          author: verificationResult?.id,
          authorType: verificationResult?.role === "admin" ? "User": "superadmin",
          company: verificationResult?.companyId,
        });
        const educationList = await newEducationList.save();
        const courseUpdate = await Course.updateMany(
          { _id: { $in: body.educations } }, // ID'lerin bulunduğu belgeleri hedef alıyoruz
          { $set: { isDelete: false } } // isDelete alanını true olarak güncelliyoruz
        );
        return NextResponse.json(
          {
            ...message201,
            data: educationList,
            updateData: courseUpdate,
          },
          { status: 201 }
        );
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
