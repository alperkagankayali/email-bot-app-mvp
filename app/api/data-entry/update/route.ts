import connectToDatabase from "@/lib/mongoose";
import { NextResponse } from "next/server";
export const dynamic = "force-dynamic"; 
import {  message201, message401, message500 } from "@/constants";
import DataEntry from "@/models/dataEntry";
import { verifyToken } from "@/lib/jwt";

export async function POST(request: Request) {
  try {
    await connectToDatabase();
    const token = request.headers.get("authorization");
    const { id, updateData } = await request.json();
    if (!!token) {
      const verificationResult = await verifyToken(token.split(" ")[1]);
      if (verificationResult instanceof NextResponse) {
        return verificationResult; // 401 döndürecek
      } else {
       const dataEntry = await DataEntry.findOneAndUpdate(
          { _id: id },
          { $set: updateData },
          { new: true }
        );
        return NextResponse.json(
          {
            ...message201,
            data: dataEntry,
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
