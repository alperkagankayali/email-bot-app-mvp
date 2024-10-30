import connectToDatabase from "@/lib/mongoose";
import User from "@/models/user";
import { NextResponse } from "next/server";
const bcrypt = require("bcryptjs");
import { message201, message401, message403, message500 } from "@/constants";
import { v4 as uuidv4 } from "uuid";
import Company from "@/models/company";
import { parse } from "csv-parse";
import { verifyToken } from "@/lib/jwt";

export async function POST(request: Request) {
  try {
    await connectToDatabase();
    const formData = await request.formData();
    const token = request.headers.get("authorization"); // API anahtarı kontrolü
    if (!!token) {
      const user: any = await verifyToken(token.split(" ")[1]);
      if (user instanceof NextResponse) {
        return user; // 401 döndürecek
      }
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
      const buffer = Buffer.from(arrayBuffer);
      let csvString = buffer.toString();
      if (csvString.charCodeAt(0) === 0xfeff) {
        csvString = csvString.slice(1);
      }
      const cleanBuffer = Buffer.from(csvString);
      return new Promise((resolve, reject) => {
        parse(
          cleanBuffer,
          {
            columns: true,
            trim: true,
            delimiter: ";", // Noktalı virgül ayırıcı olarak belirle
          },
          async (err, rows) => {
            if (err) {
              reject(
                NextResponse.json(
                  {
                    ...message500,
                  },
                  { status: 500, statusText: err.message }
                )
              );
            }
            if (
              (user.role === "admin" || user.role === "superadmin") &&
              rows.length > 0
            ) {
              const findCompany = await Company.findOne({
                _id: user.role === "admin" ? user.companyId : rows[0]?.company,
              }).sort();
              const passwordHash = bcrypt.hashSync(uuidv4().slice(0, 10), 10);
              const some = rows.some((excel: any) =>
                findCompany.emailDomainAddress.includes(
                  excel.email?.split("@")[1]
                )
              );
              if (!some) {
                resolve(
                  NextResponse.json(
                    {
                      ...message403,
                      message:
                        "Excel'deki email adresleri şirketinizde ekli değil",
                    },
                    { status: 403, statusText: "Email address not supported" }
                  )
                );
              }
              const userCreated = await User.insertMany(
                rows.map((user: any) => {
                  return { ...user, password: passwordHash };
                })
              );
              resolve(
                NextResponse.json(
                  {
                    ...message201,
                    data: userCreated,
                  },
                  { status: 201, statusText: message201.message }
                )
              );
            }
            resolve(
              NextResponse.json(
                {
                  ...message201,
                  data: rows,
                },
                { status: 201, statusText: message201.message }
              )
            );
          }
        );
      });
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

export const config = {
  api: {
    bodyParser: false, // Disable bodyParser for file handling
  },
};
