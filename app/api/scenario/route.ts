import connectToDatabase from "@/lib/mongoose";
import { NextResponse } from "next/server";
export const dynamic = "force-dynamic";
import { message200, message401, message500 } from "@/constants";
import { verifyToken } from "@/lib/jwt";
import Scenario from "@/models/scenario";
import ScenarioType from "@/models/scenarioType";
import DataEntry from "@/models/dataEntry";
import EmailTemplate from "@/models/emailTemplate";
import LandingPage from "@/models/landingPage";
import Languages from "@/models/languages";

export async function GET(request: Request) {
  try {
    await connectToDatabase();
    const { searchParams } = new URL(request.url);
    const token = request.headers.get("authorization"); // API anahtarı kontrolü
    const page = parseInt(searchParams.get("page") || "1"); // Varsayılan 1. sayfa
    const limit = parseInt(searchParams.get("limit") || "10"); // Varsayılan limit 10
    const name = searchParams.get("name") ?? "";
    const language = searchParams.get("language") ?? "";
    const scenarioType = searchParams.get("scenarioType") ?? "";
    const skip = (page - 1) * limit; //
    const id = searchParams.get("id");

    if (!!token) {
      const verificationResult = await verifyToken(token.split(" ")[1]);
      if (verificationResult instanceof NextResponse) {
        return verificationResult; // 401 döndürecek
      } else {
        if (!!id) {
          const scenario = await Scenario.findById(id)
            .populate("scenarioType")
            .populate("emailTemplate");

          return NextResponse.json(
            {
              ...message200,
              data: scenario,
              totalItems: 1,
            },
            { status: 200, statusText: message200.message }
          );
        } else {
          const scenarioTotal = await Scenario.countDocuments(
            {},
            { isDelete: false }
          );
          const filter: any = {};
          filter.isDelete = false;
          !!scenarioType && (filter.scenarioType = scenarioType);
          !!language && (filter.language = language);
          !!name && (filter.title = { $regex: name, $options: "i" });
          const scenario = await Scenario.find(filter).populate([
            { path: "emailTemplate", model: EmailTemplate },
            { path: "scenarioType", model: ScenarioType },
            { path: "language", model: Languages, select: ["code", "name"] },
          ]);
          // .populate({ path: "emailTemplate", model: EmailTemplate })
          return NextResponse.json(
            {
              ...message200,
              data: scenario,
              totalItems: scenarioTotal,
            },
            { status: 200, statusText: message200.message }
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