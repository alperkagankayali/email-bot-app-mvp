import connectToDatabase from "@/lib/mongoose";
import { NextResponse } from 'next/server';
import { SESClient, SendEmailCommand } from '@aws-sdk/client-ses';
import User from '../../../../models/user';
import Scenario from '../../../../models/scenario';
import { getS3Object } from "@/lib/aws/s3/getS3Object";

const sesClient = new SESClient({ region: 'eu-north-1' });

export async function POST(request: Request) {
  const { userId, scenarioId } = await request.json(); // Parse JSON body

  try {
    await connectToDatabase();

    // Step 1: Get the user's email
    const user = await User.findById(userId);
    if (!user) return NextResponse.json({ message: 'User not found' }, { status: 404 });
    const toEmail = user.email;

    // Step 2: Get the subject from MongoDB
    const emailContent = await Scenario.findById(scenarioId);
    if (!emailContent) return NextResponse.json({ message: 'Email content not found' }, { status: 404 });
    const subject = emailContent.title;

    // Step 3: Get the HTML body from your existing API
    const htmlBodyUrl = emailContent.emailUrl;
    const htmlBody = await getS3Object(htmlBodyUrl);
    // SES SendEmailCommand setup
    const emailParams = {
      Destination: { ToAddresses: [toEmail] },
      Message: {
        Body: { Html: { Charset: 'UTF-8', Data: htmlBody } },
        Subject: { Charset: 'UTF-8', Data: subject },
      },
      Source: 'alperkayali@klinikermed.com', // TODO: Change this later as an optional parameter.
    };

    // Send email
    const command = new SendEmailCommand(emailParams);
    await sesClient.send(command);

    return NextResponse.json({ message: 'Email sent successfully' });
  } catch (error) {
    console.error('Error sending email:', error);
    return NextResponse.json({ message: 'Internal Server Error', error }, { status: 500 });
  }
}