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
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    const user: any = await verifyToken(token.split(" ")[1]);
    if (user instanceof NextResponse) {
      return user;
    }

    const importLogs = await ImportLog.find({
      companyId: params.id,
    })
      .sort({ createdAt: -1 })
      .populate("createdBy", "name email");

    return NextResponse.json({
      success: true,
      data: importLogs,
    });
  } catch (error: any) {
    console.error("Import log fetch error:", error);
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
} 