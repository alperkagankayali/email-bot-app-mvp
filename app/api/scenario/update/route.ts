import connectToDatabase from "@/lib/mongoose";
import { NextResponse } from "next/server";
export const dynamic = "force-dynamic";
import { message201, message401, message404, message500 } from "@/constants";
import { verifyToken } from "@/lib/jwt";
import Scenario from "@/models/scenario";

export async function POST(request: Request) {
  try {
    await connectToDatabase();
    const token = request.headers.get("authorization");
    const { id, updateData } = await request.json();
    if (!!token) {
      const verificationResult: any = await verifyToken(token.split(" ")[1]);
      if (verificationResult instanceof NextResponse) {
        return verificationResult; // 401 döndürecek
      } else if (
        verificationResult?.role === "admin" ||
        verificationResult?.role === "superadmin"
      ) {
        const findScenario = await Scenario.findById(id);
        if (!findScenario) {
          return NextResponse.json(
            {
              ...message404,
              message: "Scenario not found",
            },
            { status: 404 }
          );
        } else if (
          verificationResult?.role === "admin" &&
          findScenario.authorType === "superadmin"
        ) {
          const newScenario = new Scenario({
            ...findScenario.toObject(),
            ...updateData,
            _id: undefined,
            created_at: Date.now(),
            authorType: "User",
            author: verificationResult.id,
            company: verificationResult?.companyId,
          });

          await newScenario.save();

          return NextResponse.json(
            {
              ...message201,
              data: newScenario,
            },
            { status: 201 }
          );
        } else {
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
