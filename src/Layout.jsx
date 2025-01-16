import { useState } from "react";
import { AppSidebar } from "./components/AppSidebar";
import { SidebarTrigger } from "./components/ui/sidebar";

export function Layout({ children }) {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="layout-container">
      {/* Sidebar */}

      <AppSidebar onCollapse={() => setCollapsed(!collapsed)} />

      {/* Main Content Area */}
      <main className={`layout-main ${collapsed ? "collapsed" : ""}`}>
        <div className="sidebar-trigger mb-4">
          <SidebarTrigger />
        </div>

        {children}
      </main>
    </div>
  );
}
