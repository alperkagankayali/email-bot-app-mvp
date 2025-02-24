"use client";
import "flatpickr/dist/flatpickr.min.css";
import "@/css/satoshi.css";
import "@/css/style.css";
import React, { useEffect } from "react";
import Loader from "@/components/common/Loader";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";
import { fetchLanguage } from "@/redux/slice/language";
import { useLocale } from "next-intl";
import { Suspense } from "react";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const status = useSelector((state: RootState) => state.language.status);
  const dispatch = useDispatch<AppDispatch>();
  const locale = useLocale();

  useEffect(() => {
    if (status === "idle") {
      dispatch(fetchLanguage());
    }
  }, [status, dispatch]);

  return (
    <div className="dark:bg-boxdark-2 dark:text-bodydark">
      <Suspense fallback={<Loader />}>
        {children}
      </Suspense>
    </div>
  );
}
