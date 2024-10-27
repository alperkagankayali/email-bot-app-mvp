import { message201, message500 } from "@/constants";

import { NextResponse } from "next/server";
const bcrypt = require("bcryptjs");

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const passwordHash = bcrypt.hashSync(body.password, 10);
    return NextResponse.json(
      { ...message201, data: passwordHash },
      { status: 201, statusText: message201.message }
    );
  } catch (error: any) {
    return NextResponse.json(
      { ...message500 },
      { status: 500, statusText: error?.message || "" }
    );
  }
}

