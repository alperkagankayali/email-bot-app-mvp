import { message201, message401, message500 } from "@/constants";
import connectToDatabase from "@/lib/mongoose";
import User from "@/models/user";
import { ISuperAdmin } from "@/types/superAdmingType";
import { NextResponse } from "next/server";
const bcrypt = require("bcryptjs");
import jwt from "jsonwebtoken";

export async function POST(request: Request) {
  try {
    await connectToDatabase();
    const body = await request.json();
    const token = request.headers.get("authorization"); // API anahtarı kontrolü
    const jwtKey: string = process.env.JWT_SCREET_KEY as string;
    if (!!token) {
      const user = jwt.verify(token.split(" ")[1], jwtKey) as ISuperAdmin;
      if (user.role === "superadmin") {
        const passwordHash = bcrypt.hashSync(body.password, 10);
        const resourceCreate = new User({
          ...body,
          password: passwordHash,
        });
        const resourceCreated = await resourceCreate.save();
        return NextResponse.json(
          {
            ...message201,
            data: resourceCreated,
          },
          { status: 201 }
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
