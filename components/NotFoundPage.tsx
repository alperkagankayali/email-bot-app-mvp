"use client";
import { useRouter } from "@/i18n/routing";
import { Button, Result } from "antd";

export default function NotFoundPage() {
  const router = useRouter();
  return (
    <div>
      <Result
        status="404"
        title="404"
        subTitle="Sorry, the page you visited does not exist."
        extra={
          <Button type="primary" onClick={() => router.replace("/")}>
            Back Home
          </Button>
        }
      />
    </div>
  );
}
