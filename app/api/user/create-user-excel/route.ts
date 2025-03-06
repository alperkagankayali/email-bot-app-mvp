import connectToDatabase from "@/lib/mongoose";
import User from "@/models/user";
import { NextResponse } from "next/server";
const bcrypt = require("bcryptjs");
import { message201, message401, message403, message500 } from "@/constants";
import { v4 as uuidv4 } from "uuid";
import Company from "@/models/company";
import { parse } from "csv-parse";
import { verifyToken } from "@/lib/jwt";
import ImportLog from "@/models/importLog";
import { getIO } from "@/lib/socket";

// Import log güncellemesini socket üzerinden gönder
const emitImportUpdate = async (importLogId: string, data: any) => {
  try {
    const io = getIO();
    const room = `import_${importLogId}`;
    
    // Import log'u güncelle ve populate et
    const updatedLog = await ImportLog.findById(data._id)
      .populate("createdBy", "name email");
    
    console.log(`Emitting update to room ${room}:`, updatedLog);
    io.to(room).emit("importUpdate", updatedLog);
  } catch (error) {
    console.error("Socket emit error:", error);
  }
};

// Validasyon fonksiyonları
const validateUserData = (userData: any) => {
  const errors = [];

  // Email validasyonu
  if (!userData.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(userData.email)) {
    errors.push("Geçersiz email formatı");
  }

  // Role validasyonu
  if (!["admin", "user"].includes(userData.role?.toLowerCase())) {
    errors.push("Geçersiz rol. Sadece 'admin' veya 'user' olabilir");
  }

  // İsim ve soyisim validasyonu
  if (!userData.name || !userData.surname) {
    errors.push("İsim ve soyisim zorunludur");
  }

  // Dil validasyonu
  if (!["tr", "en", "de"].includes(userData.language?.toLowerCase())) {
    errors.push("Geçersiz dil kodu. Sadece 'tr', 'en' veya 'de' olabilir");
  }

  return errors;
};

async function processExcelData(rows: any[], user: any, importLogId: string) {
  try {
    const findCompany = await Company.findOne({
      _id: user.role === "admin" ? user.companyId : rows[0]?.company,
    }).sort();

    if (!findCompany) {
      throw new Error("Şirket bulunamadı");
    }

    const passwordHash = bcrypt.hashSync(uuidv4().slice(0, 10), 10);
    const batchSize = 10; // Batch boyutunu küçülttük
    const errors = [];
    let processedCount = 0;

    // Email domain kontrolü
    for (const row of rows) {
      if (!findCompany.emailDomainAddress.includes(row.email?.split("@")[1])) {
        errors.push({
          row: processedCount + 1,
          email: row.email,
          error: "Email adresi şirket domainine ait değil",
        });
        continue;
      }

      // Validasyon kontrolü
      const validationErrors = validateUserData(row);
      if (validationErrors.length > 0) {
        errors.push({
          row: processedCount + 1,
          email: row.email,
          error: validationErrors.join(", "),
        });
        continue;
      }

      try {
        // Her kullanıcıyı tek tek kaydet
        await User.create({
          ...row,
          role: row.role?.toLowerCase(),
          nameSurname: row.name + " " + row.surname,
          password: passwordHash,
          company: user.companyId,
        });
        processedCount++;

        // Her 10 kayıtta bir log güncelle
        if (processedCount % batchSize === 0) {
          const updatedLog = await ImportLog.findByIdAndUpdate(
            importLogId,
            {
              processedRows: processedCount,
              status: "processing",
              failedRows: errors.length,
              importErrors: errors,
            },
            { new: true }
          ).populate("createdBy", "name email");

          console.log(`Progress update: ${processedCount}/${rows.length}`);
          emitImportUpdate(importLogId, updatedLog);
        }
      } catch (error: any) {
        if (error.code === 11000) {
          errors.push({
            row: processedCount + 1,
            email: row.email,
            error: "Bu email adresi zaten kullanımda",
          });
        } else {
          console.error("Kayıt hatası:", error);
          errors.push({
            row: processedCount + 1,
            email: row.email,
            error: "Kayıt işlemi sırasında hata oluştu",
          });
        }
      }
    }

    // Final durumu güncelle
    const finalLog = await ImportLog.findByIdAndUpdate(
      importLogId,
      {
        status: errors.length > 0 ? "error" : "success",
        processedRows: processedCount,
        failedRows: errors.length,
        importErrors: errors,
      },
      { new: true }
    ).populate("createdBy", "name email");

    console.log("Final status:", {
      processed: processedCount,
      errors: errors.length,
      total: rows.length
    });

    emitImportUpdate(importLogId, finalLog);
  } catch (error: any) {
    console.error("Veri işleme hatası:", error);
    const errorLog = await ImportLog.findByIdAndUpdate(
      importLogId,
      {
        status: "error",
        importErrors: [{
          row: 0,
          email: "Sistem",
          error: error.message,
        }],
      },
      { new: true }
    ).populate("createdBy", "name email");

    emitImportUpdate(importLogId, errorLog);
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

    // Import log oluştur
    const importLog = await ImportLog.create({
      companyId: user.companyId,
      createdBy: user.id,
      totalRows: 0,
      status: "processing",
      processedRows: 0,
      failedRows: 0,
      importErrors: [],
    });

    console.log("Created import log:", importLog);

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
          const errorLog = await ImportLog.findByIdAndUpdate(
            importLog._id,
            {
              status: "error",
              importErrors: [{
                row: 0,
                email: "Sistem",
                error: "CSV parse hatası: " + err.message,
              }],
            },
            { new: true }
          );
          console.log("CSV parse error log:", errorLog);
          emitImportUpdate(importLog._id, errorLog);
          return;
        }

        if (
          (user.role === "admin" || user.role === "superadmin") &&
          rows.length > 0
        ) {
          // Toplam satır sayısını güncelle
          const updatedLog = await ImportLog.findByIdAndUpdate(
            importLog._id,
            {
              totalRows: rows.length,
            },
            { new: true }
          );
          console.log("Updated total rows:", updatedLog);
          emitImportUpdate(importLog._id, updatedLog);

          // Arka planda işlemi başlat
          processExcelData(rows, user, importLog._id).catch(console.error);
        }
      }
    );

    return NextResponse.json(
      {
        ...message201,
        message: "Excel dosyası alındı ve işleme başlandı. Veriler arka planda kaydedilecek.",
        importLogId: importLog._id,
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
