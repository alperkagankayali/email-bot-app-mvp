import connectToDatabase from "@/lib/mongoose";
import { NextResponse } from "next/server";
export const dynamic = "force-dynamic";
import { message200, message401, message500 } from "@/constants";
import { verifyToken } from "@/lib/jwt";
import Campaign from "@/models/campaign";
import UserToScenarioAssignment from "@/models/userToScenarioAssignment";
import Scenario from "@/models/scenario";
import DataEntry from "@/models/dataEntry";
import { embedClickTracking } from "@/lib/campaign/prepareCampaign";

export async function GET(request: Request) {
  try {
    await connectToDatabase();
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");
    const campaignId = searchParams.get("campaignId");

    if (!!campaignId) {
      const campaign: any = await UserToScenarioAssignment.find({
        userId: userId,
        campaignId: campaignId,
      }).populate({
        path: "scenarioId",
        model: Scenario,
        // select: "dataEntry title",
        populate: {
          path: "dataEntry", 
          select:"content title",
          model: DataEntry, // Modeli belirtiyoruz
        },
      });
      //console.log("campaign", campaign);
      let modifiedDataEntry = null
      if (!!campaign) {
        console.log("modifiedDataEntry", modifiedDataEntry, campaignId, userId);
        if (userId && campaignId) {
          
          modifiedDataEntry = embedClickTracking(campaign[0].scenarioId.dataEntry.content, userId, campaignId, "data_entered");
          console.log("modifiedDataEntry inside", modifiedDataEntry);
        }
      }
      if (!!modifiedDataEntry) {
        return NextResponse.json(
          {
            ...message200,
            data: modifiedDataEntry,
          },
          { status: 200, statusText: message200.message }
        );
      }
      else {
        return NextResponse.json(
          { ...message401 },
          { status: 401, statusText: message401.message }
        );
      }
    }
  } catch (error: any) {
    return NextResponse.json(
      { ...message500 },
      { status: 500, statusText: error?.message || "" }
    );
  }
}
