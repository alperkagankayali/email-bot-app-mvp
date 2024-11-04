import connectToDatabase from "@/lib/mongoose";
import { NextResponse } from "next/server";
export const dynamic = "force-dynamic";
import { message201, message500 } from "@/constants";
import User from "@/models/user";
const bcrypt = require("bcryptjs");

export async function POST(request: Request) {
  try {
    await connectToDatabase();
    const { id, password } = await request.json();
    if (!!password && !!id) {
      const passwordHash = bcrypt.hashSync(password, 10);
      const updateUser = await User.findOneAndUpdate(
        { _id: id },
        { $set: { password: passwordHash } },
        { new: true }
      );
      return NextResponse.json(
        {
          ...message201,
          data: updateUser,
        },
        { status: 201, statusText: message201.message }
      );
    } else {
      return NextResponse.json({ ...message500 }, { status: 500 });
    }
  } catch (error: any) {
    return NextResponse.json(
      { ...message500 },
      { status: 500, statusText: error?.message || "" }
    );
  }
}
