import connectToDatabase from "@/lib/mongoose";
import User from "@/models/user";
import { NextResponse } from "next/server";
const bcrypt = require("bcryptjs");
import jwt from "jsonwebtoken";
import { IUserJWT, ISuperAdminJWT } from "../login/route";
import { message201, message401, message403, message500 } from "@/constants";
import { v4 as uuidv4 } from "uuid";
import * as XLSX from "xlsx";
import Company from "@/models/company";

export async function POST(request: Request) {
  try {
    await connectToDatabase();
    const formData = await request.formData();
    const token = request.headers.get("authorization"); // API anahtarı kontrolü
    const jwtKey: string = process.env.JWT_SCREET_KEY as string;
    if (!!token) {
      const user = jwt.verify(token.split(" ")[1], jwtKey) as
        | IUserJWT
        | ISuperAdminJWT;
      const file = formData.get("file") as Blob;
      if (!file) {
        return NextResponse.json(
          {
            ...message401,
          },
          { status: 400 }
        );
      }
      const arrayBuffer = await file.arrayBuffer();
      const uint8Array = new Uint8Array(arrayBuffer);
      const workbook = XLSX.read(uint8Array, { type: "buffer" });
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const dataexel :any[]= XLSX.utils.sheet_to_json(worksheet);
      if (
        (user.role === "admin" || user.role === "superadmin") &&
        dataexel.length > 0
      ) {
        const findCompany = await Company.findOne({_id: user.role === "admin" ? user.companyId : dataexel[0]?.company}).sort()
        const passwordHash = bcrypt.hashSync(uuidv4().slice(0, 10), 10);
        const some = dataexel.some((excel:any) =>  findCompany.emailDomainAddress.includes(excel.email?.split("@")[1]))
        if(!some){
          return NextResponse.json(
            {
              ...message403,
              message:"Excel'deki email adresleri şirketinizde ekli değil"
            },
            { status: 403, statusText: "Email address not supported" }
          );
        }
        const userCreated = await User.insertMany(
          dataexel.map((user: any) => {
            return { ...user, password: passwordHash };
          })
        );
        return NextResponse.json(
          {
            ...message201,
            data: userCreated,
          },
          { status: 201, statusText: message201.message }
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
