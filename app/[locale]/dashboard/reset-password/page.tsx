import { Metadata } from "next";
import ResetPasswordCom from "@/components/resetPassword";

export const metadata: Metadata = {
  title:
    "Next.js E-commerce Dashboard | prePhish - Next.js Dashboard Template",
  description: "This is Next.js Home for prePhish Dashboard Template",
};

export default function ResetPassword() {

  return (
    <>
      <ResetPasswordCom locale="tr" />
    </>
  );
}
