import connectToDatabase from "@/lib/mongoose";
import { NextResponse } from "next/server";
export const dynamic = "force-dynamic";
import { message200, message401, message404, message500 } from "@/constants";
import { verifyToken } from "@/lib/jwt";
import EducationList from "@/models/educationList";
import { Types } from "mongoose";
import Course from "@/models/course";

const getFilter = (url: string) => {
  const { searchParams } = new URL(url);
  const levelOfDifficulty = searchParams.get("levelOfDifficulty");
  const title = searchParams.get("title");
  const description = searchParams.get("description");
  let filter: any = {};
  if (!!title) filter.title = { $regex: title, $options: "i" }; // Büyük/küçük harf duyarsızlık için `i` ekledik
  if (!!levelOfDifficulty)
    filter.levelOfDifficulty = { $regex: levelOfDifficulty, $options: "i" }; // Büyük/küçük harf duyarsızlık için `i` ekledik
  if (!!description) {
    filter.description = { $regex: description, $options: "i" };
  }
  return filter;
};

export async function GET(request: Request) {
  try {
    await connectToDatabase();
    let filter2: any = {};
    const filter = getFilter(request.url);
    const { searchParams } = new URL(request.url);
    const token = request.headers.get("authorization"); // API anahtarı kontrolü
    const page = parseInt(searchParams.get("page") || "1"); // Varsayılan 1. sayfa
    const limit = parseInt(searchParams.get("limit") || "50"); // Varsayılan limit 10
    const skip = (page - 1) * limit; //
    const authorType = searchParams.get("authorType");
    const id = searchParams.get("id");
    const language = !!searchParams.get("language")
      ? searchParams.get("language")?.split(",")
      : null;
    if (!!language) {
      filter2.languages = { $all: language };
    }

    if (!!token) {
      const verificationResult: any = await verifyToken(token.split(" ")[1]);
      if (verificationResult instanceof NextResponse) {
        return verificationResult; // 401 döndürecek
      } else if (
        verificationResult?.role === "admin" ||
        verificationResult?.role === "superadmin"
      ) {
        if (!!authorType) {
          if (authorType.split("&").length > 1) {
            filter2["$or"] = [
              { company: verificationResult.companyId },
              { authorType: "superadmin" },
            ];
          } else {
            filter2.authorType = authorType;
          }
        }
        if (!!id) {
          const education = await EducationList.aggregate([
            {
              $match: { _id: new Types.ObjectId(id), isDelete: false },
            },

            // Educations içindeki kursları getiriyoruz
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
          ]).sort({ created_at: -1 });;
          if (education.length) {
            return NextResponse.json(
              {
                ...message200,
                data: education[0],
                totalItems: 1,
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
          if (verificationResult?.role === "superadmin") {
            const educationTotal = await EducationList.countDocuments(filter2);
            const education = await EducationList.find(filter2)
              .populate({
                path: "educations", // `educations` Course tablosuna referans içeriyor
                match: {
                  isDelete: false, // Course tablosundan sadece silinmemiş belgeler
                  // language: { $in: language }, // Belirtilen dillerle eşleşen belgeler
                  ...filter,
                  $or: [
                    { language: { $nin: language } }, // Belirtilen diller
                    { language: { $exists: true } }, // Eğer belirtilen diller yoksa herhangi bir dil
                  ],
                },

                select:
                  "title description author isPublished contents language levelOfDifficulty img", // Sadece gerekli alanlar
                model: Course,
              })
              .skip(skip)
              .limit(limit);
            return NextResponse.json(
              {
                ...message200,
                data: education.filter((e) => e.educations?.length > 0),
                totalItems: educationTotal,
              },
              { status: 200 }
            );
          }
          const educationTotal = await EducationList.countDocuments(filter2);
          const education = await EducationList.find(filter2)
            .populate({
              path: "educations", // `educations` Course tablosuna referans içeriyor
              match: {
                isDelete: false, // Course tablosundan sadece silinmemiş belgeler
                // language: { $in: language }, // Belirtilen dillerle eşleşen belgeler
                ...filter,
                $or: [
                  { language: { $in: language } }, // Belirtilen diller
                  { language: { $exists: true } }, // Eğer belirtilen diller yoksa herhangi bir dil
                ],
              },
              select:
                "title description author isPublished contents language levelOfDifficulty img", // Sadece gerekli alanlar
              model: Course,
            })
            .skip(skip)
            .limit(limit);
          return NextResponse.json(
            {
              ...message200,
              data: education.filter((e) => e.educations?.length > 0),
              totalItems: educationTotal,
            },
            { status: 200 }
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
