import connectToDatabase from "@/lib/mongoose";
import { NextResponse } from "next/server";
export const dynamic = "force-dynamic"; 
import { message200, message401, message500 } from "@/constants";
import { verifyToken } from "@/lib/jwt";
import EmailTemplate from "@/models/emailTemplate";

export async function GET(request: Request) {
  try {
    await connectToDatabase();
    const { searchParams } = new URL(request.url);
    const token = request.headers.get("authorization"); // API anahtarı kontrolü
    const page = parseInt(searchParams.get("page") || "1"); // Varsayılan 1. sayfa
    const limit = parseInt(searchParams.get("limit") || "10"); // Varsayılan limit 10
    const skip = (page - 1) * limit; //
    if (!!token) {
      const verificationResult = await verifyToken(token.split(" ")[1]);
      if (verificationResult instanceof NextResponse) {
        return verificationResult; // 401 döndürecek
      } else {
        const emailTemplateTotal = await EmailTemplate.countDocuments({},{isDelete:false});
        const emailTemplate = await EmailTemplate.find({isDelete:false}).skip(skip).limit(limit);
        return NextResponse.json(
          {
            ...message200,
            data: emailTemplate,
            totalItems: emailTemplateTotal,
          },
          { status: 200, statusText: message200.message }
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