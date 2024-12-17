"use client";

import DefaultLayout from "@/components/Layouts/DefaultLayout";
import { Link } from "@/i18n/routing";
import { Button, Result } from "antd";
import { useTranslations } from "next-intl";
import { useEffect } from "react";

type Props = {
  error: Error;
  reset(): void;
};

export default function Error({ error, reset }: Props) {
  const t = useTranslations("pages");

  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <DefaultLayout>
      <div>
        <Result
          status="500"
          title="500"
          subTitle="Sorry, something went wrong."
          extra={
            <div>
              <p>{error.message}</p>
              <Link href={"/"} type="primary">
                Back Home
              </Link>
            </div>
          }
        />
      </div>
    </DefaultLayout>
  );
}
