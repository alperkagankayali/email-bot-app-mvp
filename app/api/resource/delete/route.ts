import connectToDatabase from "@/lib/mongoose";
import { NextResponse } from "next/server";
export const dynamic = "force-dynamic";
import { message201, message401, message500 } from "@/constants";
import { verifyToken } from "@/lib/jwt";
import Resources from "@/models/resources";

export async function POST(request: Request) {
  try {
    await connectToDatabase();
    const { id } = await request.json();
    const token = request.headers.get("authorization"); // API anahtarı kontrolü
    if (!!token) {
      const verificationResult: any = await verifyToken(token.split(" ")[1]);
      if (verificationResult instanceof NextResponse) {
        return verificationResult; // 401 döndürecek
      } else if (
        verificationResult?.role === "admin" ||
        verificationResult?.role === "superadmin"
      ) {
        const resource = await Resources.findByIdAndDelete(id);
        return NextResponse.json(
          {
            ...message201,
            data: resource,
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