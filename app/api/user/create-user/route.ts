import connectToDatabase from "@/lib/mongoose";
import User from "@/models/user";
import { NextResponse } from "next/server";
const bcrypt = require("bcryptjs");
import jwt from "jsonwebtoken";
import { IUserJWT, ISuperAdminJWT } from "../login/route";
import { message201, message401, message403, message500 } from "@/constants";

export async function POST(request: Request) {
  try {
    await connectToDatabase();
    const body = await request.json();
    const token = request.headers.get("authorization"); // API anahtarı kontrolü
    const jwtKey: string = process.env.JWT_SCREET_KEY as string;
    if (!!token) {
      const user = jwt.verify(token.split(" ")[1], jwtKey) as IUserJWT;
      if (user.role === "admin") {
        const passwordHash = bcrypt.hashSync(body.password, 10);
        const userCreate = new User({
          ...body,
          company: user.companyId,
          password: passwordHash,
        });
        const userCreated = await userCreate.save();
        return NextResponse.json(
          {
            ...message201,
            company: body.company,
            data: userCreated,
          },
          { status: 201, statusText: message201.message }
        );
      } else {
        const jwtSuperAdmin = jwt.verify(
          token.split(" ")[1],
          jwtKey
        ) as ISuperAdminJWT;
        if (jwtSuperAdmin.role === "superadmin") {
          const passwordHash = bcrypt.hashSync(body.password, 10);
          const userCreate = new User({
            ...body,
            company: body.company,
            password: passwordHash,
          });
          const userCreated = await userCreate.save();
          return NextResponse.json(
            {
              ...message201,
              data: userCreated,
            },
            { status: 201, statusText: message201.message }
          );
        }
        return NextResponse.json(
          {
            ...message401,
          },
          { status: 401, statusText: message401.message }
        );
      }
    } else {
      return NextResponse.json(
        {
          ...message401,
        },
        { status: 403, statusText: message401.message }
      );
    }
  } catch (error: any) {
    return NextResponse.json(
      { ...message500 },
      { status: 500, statusText: error?.message || "" }
    );
  }
}
