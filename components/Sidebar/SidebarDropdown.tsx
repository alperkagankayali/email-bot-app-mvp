import React from "react";
import { usePathname } from "next/navigation";
import { Link } from "@/i18n/routing";
import { useTranslations } from "next-intl";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";

const SidebarDropdown = ({ item }: any) => {
  const pathname = usePathname();
  const user = useSelector((state: RootState) => state.user.user);
  const t = useTranslations("pages");

  return (
    <>
      <ul className="mb-5.5 mt-4 flex flex-col gap-2.5 pl-6">
        {item.map((item: any, index: number) => {
          if (!!item.role && !item.role.includes(user?.role)) {
            return <React.Fragment key={item.route}></React.Fragment>;
          }
          return (
            <li key={index}>
              <Link
                href={item.route}
                className={`group relative flex items-center gap-2.5 rounded-md px-4 font-medium text-bodydark2 duration-300 ease-in-out hover:text-white ${
                  pathname === item.route ? "text-white" : ""
                }`}
              >
                {t(item.label)}
              </Link>
            </li>
          );
        })}
      </ul>
    </>
  );
};

export default SidebarDropdown;
