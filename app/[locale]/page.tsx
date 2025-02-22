import Loader from "@/components/common/Loader";
import Login from "@/components/login";
import { Suspense } from "react";
export default async function HomePage({
  params: { locale },
}: {
  params: { locale: string };
}) {
  return (
    <div>
      <Suspense fallback={<Loader />}>
        <Login locale={locale} />
      </Suspense>
    </div>
  );
}
