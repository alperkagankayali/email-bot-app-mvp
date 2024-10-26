import { Link } from "@/i18n/routing";
import { useTranslations } from "next-intl";
interface BreadcrumbProps {
  pageName: string;
}
const Breadcrumb = ({ pageName }: BreadcrumbProps) => {
  const t = useTranslations("pages");

  return (
    <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <h2 className="text-title-md2 font-semibold text-black dark:text-white">
        {t(pageName)}
      </h2>

      <nav>
        <ol className="flex items-center gap-2">
          <li>
            <Link className="font-medium" href="/">
              {t("menu-title") + " "} /
            </Link>
          </li>
          <li className="font-medium text-primary">{t(pageName)}</li>
        </ol>
      </nav>
    </div>
  );
};

export default Breadcrumb;
