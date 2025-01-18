import "./App.css";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import { allRoutes } from "./routes";
import { SidebarProvider } from "./components/ui/sidebar";
import { Layout } from "./Layout";
import { CalendarProvider } from "./context/CalendarContext";
import Dashboard from "./pages/Dashboard";
import TimeSheet from "./pages/TimeSheet";
import Hello from "./pages/Hello";

function App() {
  return (
    <CalendarProvider>
      <SidebarProvider>
        <Routes>
          {/* Layout wraps the child routes */}
          <Route path="/" element={<Layout />}>
            <Route index element={<Dashboard />} />
            <Route path="timesheet" element={<TimeSheet />} />
            <Route path="*" element={<Navigate to="/" />} />
          </Route>
        </Routes>
      </SidebarProvider>
    </CalendarProvider>
  );
}

export default App;
