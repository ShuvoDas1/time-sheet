import "./App.css";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import { SidebarProvider } from "./components/ui/sidebar";
import { Layout } from "./Layout";
import { CalendarProvider } from "./context/CalendarContext";
import Dashboard from "./pages/Dashboard";
import TimeSheet from "./pages/TimeSheet";
import { DashboardProvier } from "./context/DashboardContext";

function App() {
  return (
    <DashboardProvier>
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
    </DashboardProvier>
  );
}

export default App;
