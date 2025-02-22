import connectToDatabase from "@/lib/mongoose";
import { NextResponse } from "next/server";
export const dynamic = "force-dynamic";
import { message201, message401, message500 } from "@/constants";
import { verifyToken } from "@/lib/jwt";
import { ISuperAdminJWT, IUserJWT } from "../../user/login/route";
import Campaign from "@/models/campaign";
import UserToScenarioAssignment from "@/models/userToScenarioAssignment";
import { Types } from "mongoose";
export async function POST(request: Request) {
  try {
    await connectToDatabase();
    const body = await request.json();
    const token = request.headers.get("authorization"); // API anahtarı kontrolü
    if (!!token) {
      const verificationResult: IUserJWT | ISuperAdminJWT | any =
        await verifyToken(token.split(" ")[1]);
      if (verificationResult instanceof NextResponse) {
        return verificationResult; // 401 döndürecek
      } else {
        const campaignCreate = new Campaign({
          ...body,
          authorType:
            verificationResult?.role === "superadmin" ? "superadmin" : "User",
          author: verificationResult?.id,
        });
        const campaign = await campaignCreate.save();
        if (body?.type === "phishing") {
          const userAssignmentArr = body.userList.map(async (user: string) => {
            let item =
              body.scenario[Math.floor(Math.random() * body.scenario.length)];
            const userAssignment = new UserToScenarioAssignment({
              userId: user,
              campaignId: campaign._id,
              scenarioId: item,
            });
            return await userAssignment.save();
          });
          console.log("userAssignmentArr", userAssignmentArr);
        }

        return NextResponse.json(
          {
            ...message201,
            data: campaign,
          },
          { status: 201, statusText: message201.message }
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
