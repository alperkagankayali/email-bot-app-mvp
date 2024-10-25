import { NextResponse } from "next/server";
import AWS from "aws-sdk";

const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
});

export async function GET() {
  try {
    const params = {
      Bucket: process.env.AWS_S3_BUCKET_NAME!,
      Prefix: "uploads/", // Folder path in the bucket (optional)
    };

    const data = await s3.listObjectsV2(params).promise();
    const files = data.Contents?.map((item) => ({
      key: item.Key,
      lastModified: item.LastModified,
      size: item.Size,
    }));

    return NextResponse.json({ files });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to list files" },
      { status: 500 }
    );
  }
}

// API'ye gelen POST isteğini işleme
export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;
    const fileStream = file.stream();

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const uploadParams = {
      Bucket: process.env.AWS_S3_BUCKET_NAME!,
      Key: `uploads/${file.name}`, // Path in your S3 bucket
      Body: buffer, // Using buffer instead of stream
      ContentType: file.type, // Set the correct MIME type
    };

    const data = await s3.upload(uploadParams).promise();

    return NextResponse.json({ url: data.Location });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json({ error: "File upload failed" }, { status: 500 });
  }
}
