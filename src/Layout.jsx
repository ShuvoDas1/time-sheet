import { useState } from "react";
import { AppSidebar } from "./components/AppSidebar";
import { SidebarTrigger } from "./components/ui/sidebar";
import { Toaster } from "./components/ui/sonner";
import { Outlet } from "react-router-dom";

export function Layout({ children }) {
  const [collapsed, setCollapsed] = useState(false);
  return (
    <div className="layout-container">
      {/* Sidebar */}

      <AppSidebar onCollapse={() => setCollapsed(!collapsed)} />

      {/* Main Content Area */}
      <main className={`layout-main ${collapsed ? "collapsed" : ""}`}>
        <Outlet />
      </main>
      <Toaster />
    </div>
  );
}
