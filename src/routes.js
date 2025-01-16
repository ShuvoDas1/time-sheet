import Dashboard from "./pages/Dashboard";
import EmployWorkSchedule from "./pages/EmployWorkSchedule";

import {
  Menu,
  Home,
  FileText,
  Settings,
  ChevronLeft,
  ChevronRight,
  Calendar,
} from "lucide-react";

const allRoutes = [
  {
    url: "/",
    page: Dashboard,
    title: "Dashboard",
    icon: Calendar,
  },
  {
    url: "/employee-calender",
    page: EmployWorkSchedule,
    title: "Employee Calendar",
    icon: Home,
  },
];

export { allRoutes };
