import connectToDatabase from "@/lib/mongoose";
import { NextResponse } from "next/server";
export const dynamic = "force-dynamic"; // <- add this to force dynamic render
import Scenario from "@/models/scenario";
import EmailTemplate from "@/models/emailTemplate";
import UserAction from "@/models/userAction";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const campaignId = searchParams.get('campaignId');
  const userId = searchParams.get('userId');
  const recordedUserAction = searchParams.get('recordedUserAction');
  const redirect = searchParams.get('redirect');
  try {
    
    await connectToDatabase();
    if (!campaignId || !userId || !recordedUserAction) {
      return NextResponse.json({ message: 'Missing parameter. Please provide all the parameters!' }, { status: 400 });
    }
    
    // Log the email open event in the database
    // const email = await EmailTemplate.findById(emailId);
    const potentialUserAction = await UserAction.findOne({
        userId: userId,
        campaingId: campaignId,
        action: recordedUserAction,
    });
    if (!potentialUserAction) {
        // const user = await User.findById(userId);
        const userActionCreate = new UserAction({
            userId: userId,
            campaingId: campaignId,
            action: recordedUserAction,
        });
        const userAction = userActionCreate.save();
    }
    
    if (recordedUserAction === "opened") {
        // Return a 1x1 transparent pixel as a base64-encoded image
        const pixel = Buffer.from(
            'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/wcAAwAB/6h4fWwAAAAASUVORK5CYII=',
            'base64'
        );
        return new NextResponse(pixel, {
            status: 200,
            headers: {
                'Content-Type': 'image/png',
                'Content-Length': pixel.length.toString(),
            },
        });
    }
    else {
        if (redirect) {
            return NextResponse.redirect(decodeURIComponent(redirect));
        }
    }
    
    

    
  } catch (error) {
    console.error('Error logging email open:', error);
    return NextResponse.json({ message: 'Internal Server Error', error }, { status: 500 });
  }
}
