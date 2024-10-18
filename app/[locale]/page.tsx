import Login from "@/components/login";

export default function HomePage({
  params: { locale },
}: {
  params: { locale: string };
}) {
  return (
    <div>
      <Login locale={locale}/>
    </div>
  );
}
