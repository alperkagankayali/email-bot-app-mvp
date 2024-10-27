import { message201, message401, message500 } from "@/constants";
import connectToDatabase from "@/lib/mongoose";
import { NextResponse } from "next/server";
const bcrypt = require("bcryptjs");
import SuperAdmin from "@/models/superAdmin";

export async function POST(request: Request) {
  try {
    await connectToDatabase();
    const body = await request.json();
    const headerApiKey = request.headers.get("api-key"); // API anahtarı kontrolü
    const apiKey: string = process.env.API_KEY as string;
    if (!!headerApiKey && apiKey === headerApiKey) {
      const passwordHash = bcrypt.hashSync(body.password, 10);
      const superAdmin = new SuperAdmin({
        ...body,
        password: passwordHash,
      });
      const adminCreated = await superAdmin.save();
      return NextResponse.json(
        {
          ...message201,
          data: adminCreated,
        },
        { status: 201 }
      );
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
