import connectToDatabase from "@/lib/mongoose";
import { NextResponse } from "next/server";
export const dynamic = "force-dynamic";
import { message201, message401, message500 } from "@/constants";
import { verifyToken } from "@/lib/jwt";
import LandingPage from "@/models/landingPage";

export async function GET(request: Request) {
  try {
    await connectToDatabase();
    const { id, updateData } = await request.json();
    const token = request.headers.get("authorization"); // API anahtarı kontrolü
    if (!!token) {
      const verificationResult = await verifyToken(token.split(" ")[1]);
      if (verificationResult instanceof NextResponse) {
        return verificationResult; // 401 döndürecek
      } else {
        const landingPage = await LandingPage.findOneAndUpdate(
          { _id: id },
          { $set: updateData },
          { new: true }
        );
        return NextResponse.json(
          {
            ...message201,
            data: landingPage,
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
  } catch (error: any) {
    return NextResponse.json(
      { ...message500 },
      { status: 500, statusText: error?.message || "" }
    );
  }
}
