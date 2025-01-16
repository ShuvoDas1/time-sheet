import { Calendar, Home, Inbox, Search, Settings } from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { allRoutes } from "@/routes";
import { NavLink } from "react-router-dom";

// Menu items
// const items = [
//   { title: "Home", url: "/", icon: Home },
//   { title: "Inbox", url: "/inbox", icon: Inbox },
//   { title: "Calendar", url: "/calendar", icon: Calendar },
//   { title: "Search", url: "/search", icon: Search },
//   { title: "Settings", url: "/settings", icon: Settings },
// ];

export function AppSidebar() {
  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="border-b-2 border-blue-500">
            TIME SHEET
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {allRoutes.map(({ url, title, icon: Icon }, index) => (
                <SidebarMenuItem key={index}>
                  {/* <SidebarMenuButton asChild>
                    <a href={url}>
                      <Icon />
                      <span>{title}</span>
                    </a>
                    
                  </SidebarMenuButton> */}
                  <NavLink
                    to={url}
                    className={({ isActive }) =>
                      `flex items-center p-2 rounded-md  ${
                        isActive
                          ? "bg-indigo-500 text-white"
                          : "text-black-500 hover:bg-gray-700"
                      }`
                    }
                  >
                    <Icon />
                    {title}
                  </NavLink>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
