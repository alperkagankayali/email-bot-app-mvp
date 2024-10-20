export const dynamic = 'force-dynamic'; // <- add this to force dynamic render
import Login from "@/components/login";
import {unstable_setRequestLocale} from 'next-intl/server';


export default async function HomePage({
  params: { locale },
}: {
  params: { locale: string };
}) {
  unstable_setRequestLocale(locale);
  return (
    <div>
      <Login locale={locale}/>
    </div>
  );
}