import "./App.css";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { allRoutes } from "./routes";
import { SidebarProvider } from "./components/ui/sidebar";
import { Layout } from "./Layout";
import { CalendarProvider } from "./context/CalendarContext";

function App() {
  return (
    <Router>
      <CalendarProvider>
        <SidebarProvider>
          <Layout>
            <Routes>
              {allRoutes.map(({ url, page: Page }, index) => (
                <Route key={index} path={url} element={<Page />} />
              ))}
            </Routes>
          </Layout>
        </SidebarProvider>
      </CalendarProvider>
    </Router>
  );
}

export default App;
