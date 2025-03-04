import { message201, message500 } from "@/constants";
import connectToDatabase from "@/lib/mongoose";
import Resources from "@/models/resources";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    await connectToDatabase();
    const body = await request.json();
    const resourceCreated = await Resources.insertMany(body);

    return NextResponse.json({
      ...message201,
      resourceCreated,
    });
  } catch (error) {
    console.error("Hata:", error);
    return NextResponse.json({ ...message500 }, { status: 500 });
  }
}
