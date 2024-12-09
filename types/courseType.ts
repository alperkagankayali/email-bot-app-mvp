import { IArticleType } from "./articleType";
import { ICompany } from "./companyType";
import { IQuizType } from "./quizType";
import { IUser } from "./userType";
import { IVideoType } from "./videoType";
export interface ICourse {
  title: string;
  img: string;
  description: string;
  author: IUser;
  created_at: Date;
  isPublished: boolean;
  isDelete: boolean;
  contents: IContent[];
  company: ICompany;
  authorType: "User" | "superadmin";
  language: string;
  _id: string;
}
enum ContentType {
  VIDEO = "video",
  QUIZ = "quiz",
  ARTICLE = "article",
}
export interface IContent {
  type: ContentType; // İçerik türü (video, quiz, article)
  refId: IArticleType | IVideoType | IQuizType; // Referans belge ID'si
  order: number; // Sıralama bilgisi
}

export type IEducationCreate = {
  title: string;
  img: string;
  description: string;
  isPublished: boolean;
  contents: IContent[];
};
