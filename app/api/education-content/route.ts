import connectToDatabase from "@/lib/mongoose";
import { NextResponse } from "next/server";
export const dynamic = "force-dynamic";
import { message200, message401, message500 } from "@/constants";
import { verifyToken } from "@/lib/jwt";
import Course from "@/models/course";
import Company from "@/models/company";
import User from "@/models/user";
import Article from "@/models/article";
import Video from "@/models/video";
import Quiz from "@/models/quiz";

export async function GET(request: Request) {
  try {
    await connectToDatabase();
    const { searchParams } = new URL(request.url);
    const token = request.headers.get("authorization"); // API anahtarı kontrolü
    const page = parseInt(searchParams.get("page") || "1"); // Varsayılan 1. sayfa
    const limit = parseInt(searchParams.get("limit") || "50"); // Varsayılan limit 10
    const skip = (page - 1) * limit; //
    const id = searchParams.get("id");

    if (!!token) {
      const verificationResult: any = await verifyToken(token.split(" ")[1]);
      if (verificationResult instanceof NextResponse) {
        return verificationResult; // 401 döndürecek
      } else if (verificationResult?.role === "admin") {
        if (!!id) {
          const course = await Course.findById(id);
          return NextResponse.json(
            {
              ...message200,
              data: course,
              totalItems: 1,
            },
            { status: 200, statusText: message200.message }
          );
        } else {
          const courseTotal = await Course.countDocuments({
            isDelete: false,
          });

          const courses = await Course.aggregate([
            // 1. Filtreleme
            {
              $match: { isDelete: false }, // Silinmemiş kursları getiriyoruz.
            },

            // 2. Company bilgilerini eklemek için lookup
            {
              $lookup: {
                from: "companies", // Eşleştirilecek koleksiyon
                localField: "company", // Course modelindeki "company" alanı
                foreignField: "_id", // Companies koleksiyonundaki "_id" alanı
                as: "companyInfo", // Eşleşen verilerin ekleneceği alan
                pipeline: [
                  {
                    $project: { _id: 1, companyName: 1, logo: 1 }, // Sadece gerekli alanlar alınıyor
                  },
                ],
              },
            },
            {
              $unwind: {
                path: "$companyInfo", // companyInfo dizisini düzleştiriyoruz (her kurs için bir şirket bilgisi)
                preserveNullAndEmptyArrays: true, // Eşleşme olmasa bile kursu tutuyoruz.
              },
            },

            // 3. Author bilgilerini eklemek için lookup
            {
              $lookup: {
                from: "users", // Eşleştirilecek koleksiyon
                localField: "author", // Course modelindeki "author" alanı
                foreignField: "_id", // Users koleksiyonundaki "_id" alanı
                as: "authorInfo", // Eşleşen verilerin ekleneceği alan
                pipeline: [
                  {
                    $project: {
                      _id: 1, // Kullanıcının ID'si
                      nameSurname: 1, // Kullanıcının adı
                      email: 1, // Kullanıcının email adresi
                      role: 1, // Kullanıcının rolü
                      department: 1, // Kullanıcının departmanı
                    },
                  },
                ],
              },
            },
            {
              $unwind: {
                path: "$authorInfo", // authorInfo dizisini düzleştiriyoruz (her kurs için bir yazar bilgisi)
                preserveNullAndEmptyArrays: true, // Eşleşme olmasa bile kursu tutuyoruz.
              },
            },

            // 4. Video içeriklerini eklemek için lookup
            {
              $lookup: {
                from: "videos", // Eşleştirilecek koleksiyon
                localField: "contents.refId", // Course modelindeki contents.refId alanı
                foreignField: "_id", // Videos koleksiyonundaki "_id" alanı
                as: "contentsVideo", // Eşleşen verilerin ekleneceği alan
              },
            },

            // 5. Quiz içeriklerini eklemek için lookup
            {
              $lookup: {
                from: "quizzes", // Eşleştirilecek koleksiyon
                localField: "contents.refId", // Course modelindeki contents.refId alanı
                foreignField: "_id", // Quizzes koleksiyonundaki "_id" alanı
                as: "contentsQuiz", // Eşleşen verilerin ekleneceği alan
              },
            },

            // 6. Article içeriklerini eklemek için lookup
            {
              $lookup: {
                from: "articles", // Eşleştirilecek koleksiyon
                localField: "contents.refId", // Course modelindeki contents.refId alanı
                foreignField: "_id", // Articles koleksiyonundaki "_id" alanı
                as: "contentsArticle", // Eşleşen verilerin ekleneceği alan
              },
            },

            // 7. İçerikleri (contents) refId'ye göre eşleştirme
            {
              $addFields: {
                contents: {
                  $map: {
                    input: "$contents", // Course modelindeki "contents" alanını işliyoruz
                    as: "content", // İçeriğin her bir öğesi için alias
                    in: {
                      $mergeObjects: [
                        "$$content", // Orijinal içerik bilgisi
                        {
                          $switch: {
                            branches: [
                              {
                                case: { $eq: ["$$content.type", "video"] }, // Eğer içerik tipi video ise
                                then: {
                                  refId: {
                                    $arrayElemAt: [
                                      {
                                        $filter: {
                                          input: "$contentsVideo", // Video içerikleri
                                          as: "video",
                                          cond: {
                                            $eq: [
                                              "$$video._id",
                                              "$$content.refId",
                                            ], // refId eşleşmesi
                                          },
                                        },
                                      },
                                      0,
                                    ],
                                  },
                                },
                              },
                              {
                                case: { $eq: ["$$content.type", "quiz"] }, // Eğer içerik tipi quiz ise
                                then: {
                                  refId: {
                                    $arrayElemAt: [
                                      {
                                        $filter: {
                                          input: "$contentsQuiz", // Quiz içerikleri
                                          as: "quiz",
                                          cond: {
                                            $eq: [
                                              "$$quiz._id",
                                              "$$content.refId",
                                            ], // refId eşleşmesi
                                          },
                                        },
                                      },
                                      0,
                                    ],
                                  },
                                },
                              },
                              {
                                case: { $eq: ["$$content.type", "article"] }, // Eğer içerik tipi article ise
                                then: {
                                  refId: {
                                    $arrayElemAt: [
                                      {
                                        $filter: {
                                          input: "$contentsArticle", // Article içerikleri
                                          as: "article",
                                          cond: {
                                            $eq: [
                                              "$$article._id",
                                              "$$content.refId",
                                            ], // refId eşleşmesi
                                          },
                                        },
                                      },
                                      0,
                                    ],
                                  },
                                },
                              },
                            ],
                            default: "$$content.refId", // Varsayılan olarak orijinal refId
                          },
                        },
                      ],
                    },
                  },
                },
              },
            },

            // 8. Gereksiz alanları kaldırıyoruz
            {
              $project: {
                contentsVideo: 0, // contentsVideo alanını kaldır
                contentsQuiz: 0, // contentsQuiz alanını kaldır
                contentsArticle: 0, // contentsArticle alanını kaldır
              },
            },
          ]);
          console.log(courses);
          return NextResponse.json(
            {
              ...message200,
              data: courses,
              totalItems: courseTotal,
            },
            { status: 200, statusText: message200.message }
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
    return NextResponse.json(
      { ...message500 },
      { status: 500, statusText: error?.message || "" }
    );
  }
}
