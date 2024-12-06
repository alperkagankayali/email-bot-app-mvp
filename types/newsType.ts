import { ICompany } from "./companyType";
import { ISuperAdmin } from "./superAdmingType";
import { IUser } from "./userType";

export interface INewsBlog {
  headline: string; // Haber başlığı
  content: string; // Haber içeriği
  created_at: Date; // Oluşturulma tarihi
  updated_at: Date; // Güncellenme tarihi
  featuredImageUrl: string; // Öne çıkan görsel URL'si
  author: IUser | ISuperAdmin; // Yazarın kullanıcı kimliği
  category: string; // Haber kategorisi
  tags: string[]; // Haber etiketleri
  isPublished: boolean; // Haber yayında mı?
  authorType: "user" | "superadmin";
  company: ICompany;
  language: string;
  previewCount: number;
}
