import connectToDatabase from "@/lib/mongoose";
import { NextResponse } from "next/server";
export const dynamic = "force-dynamic";
import { message200, message201, message401, message500 } from "@/constants";
import { verifyToken } from "@/lib/jwt";
import LandingPage from "@/models/landingPage";

export async function POST(request: Request) {
  try {
    await connectToDatabase();
    const body = await request.json();
    const token = request.headers.get("authorization"); // API anahtarı kontrolü
    if (!!token) {
      const verificationResult: any = await verifyToken(token.split(" ")[1]);
      if (verificationResult instanceof NextResponse) {
        return verificationResult; // 401 döndürecek
      } else {
        const landingCreate = new LandingPage({
          ...body,
          author: verificationResult?.id,
          authorType:
            verificationResult?.role === "admin" ? "User" : "superadmin",
          company: verificationResult?.companyId,
        });
        const landingPage = await landingCreate.save();
        return NextResponse.json(
          {
            ...message201,
            data: landingPage,
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
  } catch (error: any) {
    return NextResponse.json({ ...message500 }, { status: 500 });
  }
}
