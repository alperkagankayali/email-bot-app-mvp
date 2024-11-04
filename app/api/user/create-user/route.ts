import connectToDatabase from "@/lib/mongoose";
import User from "@/models/user";
import { NextResponse } from "next/server";
const bcrypt = require("bcryptjs");
import jwt from "jsonwebtoken";
import { IUserJWT, ISuperAdminJWT } from "../login/route";
import { message201, message401, message403, message500 } from "@/constants";
import { v4 as uuidv4 } from "uuid";
import Company from "@/models/company";

export async function POST(request: Request) {
  try {
    await connectToDatabase();
    const body = await request.json();
    const token = request.headers.get("authorization"); // API anahtarı kontrolü
    const jwtKey: string = process.env.JWT_SCREET_KEY as string;
    if (!!token) {
      const user = jwt.verify(token.split(" ")[1], jwtKey) as IUserJWT;
      if (user.role === "admin") {
        const passwordHash = bcrypt.hashSync(
          !!body.password ? body.password : uuidv4().slice(0, 10),
          10
        );
        const findCompany = await Company.findOne({ _id: user.companyId });
        const some = findCompany.emailDomainAddress?.includes(
          body?.email?.split("@")[1]
        );
        if (!some) {
          return NextResponse.json(
            {
              ...message403,
              message: "Excel'deki email adresleri şirketinizde ekli değil",
            },
            { status: 403, statusText: "Email address not supported" }
          );
        }
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
          const passwordHash = bcrypt.hashSync(
            !!body.password ? body.password : uuidv4().slice(0, 10),
            10
          );
          const findUser = await User.find({
            company: body.company,
            role: "admin",
          });
          if (findUser.length > 0 || body.role === "admin") {
            const findCompany = await Company.findOne({ _id: body.company });
            const some = findCompany?.emailDomainAddress?.includes(
              body?.email?.split("@")[1]
            );
            if (!some) {
              return NextResponse.json(
                {
                  ...message403,
                  message: "email adresleri şirketinizde ekli değil",
                },
                { status: 403, statusText: "Email address not supported" }
              );
            }
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
              ...message403,
            },
            { status: 403, statusText: message403.message }
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
