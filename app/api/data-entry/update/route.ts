import connectToDatabase from "@/lib/mongoose";
import { NextResponse } from "next/server";
export const dynamic = "force-dynamic";
import { message201, message401, message404, message500 } from "@/constants";
import DataEntry from "@/models/dataEntry";
import { verifyToken } from "@/lib/jwt";

export async function POST(request: Request) {
  try {
    await connectToDatabase();
    const token = request.headers.get("authorization");
    const { id, updateData } = await request.json();
    if (!!token) {
      const verificationResult: any = await verifyToken(token.split(" ")[1]);
      if (verificationResult instanceof NextResponse) {
        return verificationResult; // 401 döndürecek
      } else if (
        verificationResult?.role === "admin" ||
        verificationResult?.role === "superadmin"
      ) {
        const findDataEntry = await DataEntry.findById(id);
        if (!findDataEntry) {
          return NextResponse.json(
            {
              ...message404,
            },
            { status: 404 }
          );
        } else if (
          verificationResult?.role === "admin" &&
          findDataEntry.authorType === "superadmin"
        ) {
          const newDataEntry = new DataEntry({
            ...findDataEntry.toObject(),
            ...updateData,
            _id: undefined,
            authorType: "User",
            author: verificationResult.id,
            company: verificationResult?.companyId,
          });

          await newDataEntry.save();

          return NextResponse.json(
            {
              ...message201,
              data: newDataEntry,
            },
            { status: 201 }
          );
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
            { status: 201 }
          );
        }
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
