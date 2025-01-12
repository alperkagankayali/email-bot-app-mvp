import connectToDatabase from "@/lib/mongoose";
import { NextResponse } from "next/server";
export const dynamic = "force-dynamic";
import { message201, message401, message500 } from "@/constants";
import { verifyToken } from "@/lib/jwt";
import Scenario from "@/models/scenario";
import { ISuperAdminJWT, IUserJWT } from "../../user/login/route";

export async function POST(request: Request) {
  try {
    await connectToDatabase();
    const token = request.headers.get("authorization");
    const { id, updateData, isDelete } = await request.json();
    if (!!token) {
      const verificationResult: IUserJWT | ISuperAdminJWT | any =
        await verifyToken(token.split(" ")[1]);
      if (verificationResult instanceof NextResponse) {
        return verificationResult; // 401 döndürecek
      } else if (verificationResult.role === "superadmin") {
        const findByScenario = await Scenario.findById(id);
        if (JSON.parse(isDelete)) {
          const existingEducationIds = findByScenario.education.map(
            (edu: any) => edu.toString()
          );
          updateData.education = existingEducationIds.filter((newId: any) => {
            return !updateData.education.includes(newId.toString());
          });
          const scenario = await Scenario.findOneAndUpdate(
            { _id: id },
            { $set: updateData },
            { new: true }
          );
          return NextResponse.json(
            {
              ...message201,
              data: scenario,
            },
            { status: 201, statusText: message201.message }
          );
        } else {
          const existingEducationIds = findByScenario.education.map(
            (edu: any) => edu.toString()
          );
          const scenario = await Scenario.findOneAndUpdate(
            { _id: id },
            {
              $addToSet: {
                education: {
                  $each: updateData.education.filter((newId: any) => {
                    return !existingEducationIds.includes(newId.toString());
                  }),
                },
              },
            },
            { new: true }
          );
          return NextResponse.json(
            {
              ...message201,
              data: scenario,
            },
            { status: 201, statusText: message201.message }
          );
        }
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
