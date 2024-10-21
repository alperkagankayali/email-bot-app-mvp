import { NextResponse } from 'next/server';
import path from 'path';
import { promises as fs } from 'fs';
import { v4 as uuidv4 } from 'uuid';

// API'ye gelen POST isteğini işleme
export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as Blob | null;

    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }

    // Dosya verilerini okuma
    const buffer = Buffer.from(await file.arrayBuffer());

    // Dosya adını belirleme (unique bir isim veriyoruz)
    const fileName = `${uuidv4()}.png`;  // Dosya türünü isteğe göre değiştirebilirsiniz
    const filePath = path.join(process.cwd(), 'public', 'upload', fileName);

    // Dosyayı public/upload klasörüne kaydetme
    await fs.writeFile(filePath, buffer);

    // Dosyanın URL'sini döndürme
    const fileUrl = `/upload/${fileName}`;
    return NextResponse.json({ imageUrl: fileUrl }, { status: 200 });
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json({ error: 'File upload failed' }, { status: 500 });
  }
}
