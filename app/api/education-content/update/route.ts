import connectToDatabase from "@/lib/mongoose";
import { NextResponse } from "next/server";
export const dynamic = "force-dynamic";
import { message201, message401, message404, message500 } from "@/constants";
import { verifyToken } from "@/lib/jwt";
import Course from "@/models/course";

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
        const findCourse = await Course.findById(updateData._id);
        if (!findCourse) {
          return NextResponse.json(
            {
              ...message404,
              message: "Course not found",
            },
            { status: 404 }
          );
        } else if (
          verificationResult?.role === "admin" &&
          findCourse.authorType === "superadmin"
        ) {
          const newVideo = new Course({
            ...findCourse.toObject(),
            ...updateData,
            _id: undefined,
            authorType: "User",
            author: verificationResult.id,
          });

          await newVideo.save();

          return NextResponse.json(
            {
              ...message201,
              data: newVideo,
            },
            { status: 201 }
          );
        } else {
          const article = await Course.findOneAndUpdate(
            { _id: updateData._id },
            { $set: updateData },
            { new: true }
          );
          return NextResponse.json(
            {
              ...message201,
              data: article,
            },
            { status: 201 }
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
