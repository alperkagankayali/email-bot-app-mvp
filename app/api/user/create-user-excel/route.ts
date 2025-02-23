import connectToDatabase from "@/lib/mongoose";
import User from "@/models/user";
import { NextResponse } from "next/server";
const bcrypt = require("bcryptjs");
import { message201, message401, message403, message500 } from "@/constants";
import { v4 as uuidv4 } from "uuid";
import Company from "@/models/company";
import { parse } from "csv-parse";
import { verifyToken } from "@/lib/jwt";

async function processExcelData(rows: any[], user: any) {
  try {
    const findCompany = await Company.findOne({
      _id: user.role === "admin" ? user.companyId : rows[0]?.company,
    }).sort();

    const passwordHash = bcrypt.hashSync(uuidv4().slice(0, 10), 10);
    const some = rows.some((excel: any) =>
      findCompany.emailDomainAddress.includes(excel.email?.split("@")[1])
    );

    if (!some) {
      console.error("------Excel'deki email adresleri şirkette ekli değil");
      return;
    }

    const userCreated = await User.insertMany(
      rows.map((usermap: any) => {
        return { ...usermap, password: passwordHash, company: user.companyId };
      })
    );

    console.log(`****** ${userCreated.length} kullanıcı başarıyla oluşturuldu`);
  } catch (error) {
    console.error("-----Veri işleme hatası:", error);
  }
}

export async function POST(request: Request) {
  try {
    await connectToDatabase();
    const formData = await request.formData();
    const token = request.headers.get("authorization");

    if (!token) {
      return NextResponse.json(
        { ...message401 },
        { status: 403, statusText: message401.message }
      );
    }

    const user: any = await verifyToken(token.split(" ")[1]);
    if (user instanceof NextResponse) {
      return user;
    }

    const file = formData.get("file") as Blob;
    if (!file) {
      return NextResponse.json({ ...message401 }, { status: 400 });
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    let csvString = buffer.toString();
    if (csvString.charCodeAt(0) === 0xfeff) {
      csvString = csvString.slice(1);
    }
    const cleanBuffer = Buffer.from(csvString);

    // Parse CSV and start background processing
    parse(
      cleanBuffer,
      {
        columns: true,
        trim: true,
        delimiter: ",",
      },
      async (err, rows) => {
        if (err) {
          console.error("CSV parse hatası:", err);
          return;
        }
        if (
          (user.role === "admin" || user.role === "superadmin") &&
          rows.length > 0
        ) {
          // Arka planda işlemi başlat
          processExcelData(rows, user).catch(console.error);
        }
      }
    );

    // Hemen başarılı yanıt dön
    return NextResponse.json(
      {
        ...message201,
        message:
          "Excel dosyası alındı ve işleme başlandı. Veriler arka planda kaydedilecek.",
      },
      { status: 202 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { ...message500 },
      { status: 500, statusText: error?.message || "" }
    );
  }
}
