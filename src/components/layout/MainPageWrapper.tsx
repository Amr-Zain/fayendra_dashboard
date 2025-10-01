import React from "react";
import { useTranslation } from "react-i18next";
import { ChevronsRight } from "lucide-react";
import { Link } from "@tanstack/react-router";

export interface breadcrumbItem {
  label:string,
  to?:string,
  icon?: React.ReactNode
}

interface Props {
  children: React.ReactNode;
  breadcrumbItems:breadcrumbItem[]
}


const MainPageWrapper = ({children,breadcrumbItems}: Props) => {
  const { t } = useTranslation();

  return (
    <section data-aos="fade-up">
      <ul className="flex items-center gap-2 mb-4">
        {breadcrumbItems?.map((item, index) => {
          const { to, label, icon } = item
          const isLastItem = breadcrumbItems.length === index + 1
          return (
            <li key={index} className="flex items-center gap">
              {to ? (
                <Link
                to={to}
                className={`page-title`}
                >
                      {icon && icon} {t(label)}
                    </Link>
              ) : (
                <span className="page-title">
                  {icon && icon} {t(label)}
                </span>
              )}
              {!isLastItem && (
                <ChevronsRight className="size-5 rtl:rotate-180" />
              )}
            </li>
          )
        })}
      </ul>
      <div className="main-card gap-6 py-6">{children}</div>
    </section>
  )
};

export default MainPageWrapper;
