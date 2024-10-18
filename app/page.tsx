import Login from "@/components/login";

export default async function Home({
  params: { locale },
}: {
  params: { locale: string };
}) {
  return (
    <div>
      <Login locale={locale} />
    </div>
  );
}
