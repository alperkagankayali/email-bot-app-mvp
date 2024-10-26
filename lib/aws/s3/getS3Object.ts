// lib/getS3Object.ts

import { S3Client, GetObjectCommand } from '@aws-sdk/client-s3';
import { Readable } from 'stream';

const s3Client = new S3Client({ region: 'eu-north-1' });

export async function getS3Object(s3Uri: string): Promise<string> {
  const uriParts = s3Uri.replace('s3://', '').split('/');
  const bucketName = uriParts[0];
  const key = uriParts.slice(1).join('/');

  const command = new GetObjectCommand({ Bucket: bucketName, Key: key });
  const response = await s3Client.send(command);

  // Convert stream to string
  const streamToString = (stream: Readable) => {
    return new Promise<string>((resolve, reject) => {
      const chunks: Buffer[] = [];
      stream.on('data', (chunk) => chunks.push(Buffer.from(chunk)));
      stream.on('end', () => resolve(Buffer.concat(chunks).toString('utf-8')));
      stream.on('error', reject);
    });
  };

  const htmlBody = await streamToString(response.Body as Readable);
  return htmlBody;
}