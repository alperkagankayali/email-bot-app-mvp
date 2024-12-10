import connectToDatabase from "@/lib/mongoose";
import { NextResponse } from "next/server";
export const dynamic = "force-dynamic"; // <- add this to force dynamic render
import UserAction from "../../../../../models/userAction";
import Campaign from "../../../../../models/campaign";
import User from "../../../../../models/user";
import Scenario from "@/models/scenario";
import EmailTemplate from "@/models/emailTemplate";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const emailId = searchParams.get('emailId');
  const userId = searchParams.get('userId');
  
  try {
    
    await connectToDatabase();
    if (!emailId) {
      return NextResponse.json({ message: 'emailId parameter is required' }, { status: 400 });
    }
    
    // Log the email open event in the database
    // const email = await EmailTemplate.findById(emailId);
    
    const scenarios = await Scenario.find(
      {
        emailTemplate: emailId,
      }
    );
    for (const scenario of scenarios) {
      const campaigns = await Campaign.find(
        {
          scenario: scenario._id,
        }
      );
      for (const campaign of campaigns) {
        const potentialUserAction = await UserAction.findOne({
          userId: userId,
          campaingId: campaign._id,
          action: "opened",
        });
        if (!potentialUserAction) {
          // const user = await User.findById(userId);
          const userActionCreate = new UserAction({
            userId: userId,
            campaingId: campaign._id,
            action: "opened",
          });

          const userAction = userActionCreate.save();
        }
      }
    }
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
  } catch (error) {
    console.error('Error logging email open:', error);
    return NextResponse.json({ message: 'Internal Server Error', error }, { status: 500 });
  }
}
