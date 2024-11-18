import { ICompany } from "./companyType";
import { IUser } from "./userType";
export interface ICourse {
  title: string;
  img: string;
  description: string;
  author: IUser;
  created_at: Date;
  isPublished: boolean;
  isDelete: boolean;
  contents: Content[];
  company: ICompany;
}
enum ContentType {
  VIDEO = "video",
  QUIZ = "quiz",
  ARTICLE = "article",
}
export interface Content {
  type: ContentType; // İçerik türü (video, quiz, article)
  refId: string; // Referans belge ID'si
  order: number; // Sıralama bilgisi
}

export  type IEducationCreate = {
  title: string;
  img: string;
  description: string;
  isPublished: boolean;
  contents: Content[];

}