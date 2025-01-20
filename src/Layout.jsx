import { useState } from "react";
import { AppSidebar } from "./components/AppSidebar";
import { SidebarTrigger } from "./components/ui/sidebar";
import { Toaster } from "./components/ui/sonner";
import { Outlet } from "react-router-dom";
import { ModeToggle } from "./components/ModeToggle";
import { useTheme } from "next-themes";

export function Layout({ children }) {
  const [collapsed, setCollapsed] = useState(false);
  const { value } = useTheme();
  return (
    <div className="layout-container">
      {/* Sidebar */}

      <AppSidebar onCollapse={() => setCollapsed(!collapsed)} />

      {/* Main Content Area */}
      <main className={`layout-main ${collapsed ? "collapsed" : ""}`}>
        <div className="flex justify-between items-center flex-wrap mb-5">
          <SidebarTrigger />
          <ModeToggle />
        </div>
        <Outlet />
      </main>
      <Toaster />
    </div>
  );
}
