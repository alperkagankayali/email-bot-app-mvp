import connectToDatabase from "@/lib/mongoose";
import { NextResponse } from "next/server";
export const dynamic = "force-dynamic"; // <- add this to force dynamic render
import jwt from "jsonwebtoken";
import { ISuperAdminJWT, IUserJWT } from "../login/route";
import { message200, message401, message500 } from "@/constants";
import { json2csv } from "json-2-csv";

export async function GET(request: Request) {
  try {
    await connectToDatabase();
    const token = request.headers.get("authorization"); // API anahtarı kontrolü
    const jwtKey: string = process.env.JWT_SCREET_KEY as string;
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    if (!!token) {
      const user = jwt.verify(token.split(" ")[1], jwtKey) as IUserJWT;
      if (user.role === "admin") {
        const csv = await json2csv(
          [
            {
              name: "",
              surname: "",
              email: "",
              language: "",
              department: "",
              role: "",
            },
          ],
          { delimiter: "," as any }
        ); // Promise kullanarak dönüştür

        return NextResponse.json(
          {
            ...message200,
            data: csv,
          },
          { status: 201 }
        );
      } else {
        const jwtSuperAdmin = jwt.verify(
          token.split(" ")[1],
          jwtKey
        ) as ISuperAdminJWT;
        if (jwtSuperAdmin.role === "superadmin") {
          const csv = await json2csv(
            [
              {
                name: "",
                surname: "",
                email: "",
                language: "",
                department: "",
                role: "",
              },
            ],
            { delimiter: "," as any }
          ); // Promise kullanarak dönüştür

          return NextResponse.json(
            {
              ...message200,
              data: csv,
            },
            { status: 201 }
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
