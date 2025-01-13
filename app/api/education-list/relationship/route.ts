import connectToDatabase from "@/lib/mongoose";
import { NextResponse } from "next/server";
export const dynamic = "force-dynamic";
import { message200, message401, message404, message500 } from "@/constants";
import { verifyToken } from "@/lib/jwt";
import EducationList from "@/models/educationList";
import { Types } from "mongoose";

export async function POST(request: Request) {
  try {
    await connectToDatabase();
    const token = request.headers.get("authorization");
    const { id } = await request.json();

    if (!!token) {
      const verificationResult: any = await verifyToken(token.split(" ")[1]);
      if (verificationResult instanceof NextResponse) {
        return verificationResult; // 401 döndürecek
      } else if (
        verificationResult?.role === "admin" ||
        verificationResult?.role === "superadmin"
      ) {
        if (!!id && id.length > 0) {
          const education = await EducationList.aggregate([
            {
              $match: {
                _id: {
                  $in: id.map((element: string) => new Types.ObjectId(element)),
                }, // id dizisini ObjectId'lere çevir ve $in ile eşleştir
                isDelete: false,
              },
            },
            {
              $lookup: {
                from: "courses",
                localField: "educations",
                foreignField: "_id",
                as: "educations",
                pipeline: [
                  {
                    $match: { isDelete: false },
                  },
                  {
                    $lookup: {
                      from: "videos",
                      localField: "contents.refId",
                      foreignField: "_id",
                      as: "contentsVideo",
                      pipeline: [
                        {
                          $project: { _id: 1, title: 1, description: 1 },
                        },
                      ],
                    },
                  },
                  {
                    $lookup: {
                      from: "quizzes",
                      localField: "contents.refId",
                      foreignField: "_id",
                      as: "contentsQuiz",
                      pipeline: [
                        {
                          $project: { _id: 1, title: 1, description: 1 },
                        },
                      ],
                    },
                  },
                  {
                    $lookup: {
                      from: "articles",
                      localField: "contents.refId",
                      foreignField: "_id",
                      as: "contentsArticle",
                      pipeline: [
                        {
                          $project: { _id: 1, title: 1, description: 1 },
                        },
                      ],
                    },
                  },
                  {
                    $addFields: {
                      contents: {
                        $map: {
                          input: "$contents",
                          as: "content",
                          in: {
                            type: "$$content.type",
                            refId: {
                              $switch: {
                                branches: [
                                  {
                                    case: { $eq: ["$$content.type", "video"] },
                                    then: {
                                      $arrayElemAt: [
                                        {
                                          $filter: {
                                            input: "$contentsVideo",
                                            as: "video",
                                            cond: {
                                              $eq: [
                                                "$$video._id",
                                                "$$content.refId",
                                              ],
                                            },
                                          },
                                        },
                                        0,
                                      ],
                                    },
                                  },
                                  {
                                    case: { $eq: ["$$content.type", "quiz"] },
                                    then: {
                                      $arrayElemAt: [
                                        {
                                          $filter: {
                                            input: "$contentsQuiz",
                                            as: "quiz",
                                            cond: {
                                              $eq: [
                                                "$$quiz._id",
                                                "$$content.refId",
                                              ],
                                            },
                                          },
                                        },
                                        0,
                                      ],
                                    },
                                  },
                                  {
                                    case: {
                                      $eq: ["$$content.type", "article"],
                                    },
                                    then: {
                                      $arrayElemAt: [
                                        {
                                          $filter: {
                                            input: "$contentsArticle",
                                            as: "article",
                                            cond: {
                                              $eq: [
                                                "$$article._id",
                                                "$$content.refId",
                                              ],
                                            },
                                          },
                                        },
                                        0,
                                      ],
                                    },
                                  },
                                ],
                                default: null,
                              },
                            },
                            order: "$$content.order",
                            _id: "$$content._id",
                          },
                        },
                      },
                    },
                  },
                  {
                    $addFields: {
                      contents: {
                        $map: {
                          input: "$contents",
                          as: "content",
                          in: {
                            type: "$$content.type",
                            refId: "$$content.refId._id",
                            title: "$$content.refId.title",
                            description: "$$content.refId.description",
                            order: "$$content.order",
                            _id: "$$content._id",
                          },
                        },
                      },
                    },
                  },
                  {
                    $project: {
                      contentsVideo: 0,
                      contentsQuiz: 0,
                      contentsArticle: 0,
                    },
                  },
                ],
              },
            },
            {
              $addFields: {
                educations: { $arrayElemAt: ["$educations", 0] }, // İlk elemanı al
              },
            },
            {
              $project: {
                _id: 1,
                author: 1,
                authorType: 1,
                isDelete: 1,
                educations: 1,
                languages: 1,
                created_at: 1,
              },
            },
          ]);

          if (education.length > 0) {
            return NextResponse.json(
              {
                ...message200,
                data: education,
                totalItems: education.length,
              },
              { status: 200 }
            );
          } else {
            return NextResponse.json(
              {
                ...message404,
                data: [],
                totalItems: 1,
              },
              { status: 400 }
            );
          }
        } else {
          return NextResponse.json(
            {
              ...message404,
              data: [],
              totalItems: 1,
            },
            { status: 400 }
          );
        }
      } else {
        return NextResponse.json(
          {
            ...message401,
          },
          { status: 401 }
        );
      }
    } else {
      return NextResponse.json(
        {
          ...message401,
        },
        { status: 401 }
      );
    }
  } catch (error: any) {
    return NextResponse.json({ ...message500 }, { status: 500 });
  }
}
