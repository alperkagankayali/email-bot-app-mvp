import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongoose";
import ImportLog from "@/models/importLog";
import { verifyToken } from "@/lib/jwt";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await connectToDatabase();
    const token = request.headers.get("authorization");

    if (!token) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const user: any = await verifyToken(token.split(" ")[1]);
    if (user instanceof NextResponse) {
      return user;
    }

    const importLog = await ImportLog.findOne({
      _id: params.id,
      companyId: user.companyId,
    }).populate("createdBy", "nameSurname email");

    if (!importLog) {
      return NextResponse.json(
        { message: "Import log not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(importLog);
  } catch (error: any) {
    return NextResponse.json({
      message: error.message || "Internal server error",
    });
  }
}
