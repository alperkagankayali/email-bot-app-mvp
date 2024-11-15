import { IArticleType } from "./articleType";
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
  contents: string;
  isDelete: boolean;
  videos: IVideoType[];
  article: IArticleType[];
  quiz: IQuizType[];
}
