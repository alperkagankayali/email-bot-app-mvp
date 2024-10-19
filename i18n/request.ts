import { notFound } from "next/navigation";
import { getRequestConfig } from "next-intl/server";
import { routing } from "./routing";
import { getResource } from "@/services/service/generalService";
// import { useDispatch } from "react-redux";
import { handleResourceChange } from "@/redux/slice/resource";
import { makeStore } from "@/redux/store";

export default getRequestConfig(async ({ locale }) => {
  // Validate that the incoming `locale` parameter is valid
  if (!routing.locales.includes(locale as any)) notFound();

  const res: any = await getResource(locale);
  // const dispatch = useDispatch();
  // makeStore().dispatch(handleResourceChange(res.data.data));

  if (!!res.data) {
    return {
      messages: res.data,
    };
  }
  return {
    messages: (await import(`../messages/${locale}.json`)).default,
  };
});
