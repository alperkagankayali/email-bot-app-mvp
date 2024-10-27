import { Types } from "mongoose";
export interface ISuperAdmin {
  nameSurname: string;
  email: string;
  language: string;
  password: string;
  role: "superadmin";
  _id: Types.ObjectId;
  isDelete: boolean;
  createdAt: Date;
}
