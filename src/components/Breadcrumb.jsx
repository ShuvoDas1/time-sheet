import React from "react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { SidebarTrigger } from "./ui/sidebar";

const CommonBreadcrumb = ({ links, pageName }) => {
  return (
    <div>
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <div className="sidebar-trigger mb-4">
              <SidebarTrigger />
            </div>
          </BreadcrumbItem>
          {links &&
            links.lenght > 0 &&
            links.map(({ url, title }, index) => {
              return (
                <>
                  <BreadcrumbItem key={index}>
                    <BreadcrumbLink href={url}>{title}</BreadcrumbLink>
                  </BreadcrumbItem>
                </>
              );
            })}

          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>{pageName}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
    </div>
  );
};

export default CommonBreadcrumb;
