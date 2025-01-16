import "./App.css";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { AppSidebar } from "./components/AppSidebar";
import { allRoutes } from "./routes";
import Dashboard from "./pages/Dashboard";
import { SidebarProvider, SidebarTrigger } from "./components/ui/sidebar";
import { Layout } from "./Layout";

function App() {
  return (
    <Router>
      <SidebarProvider>
        <Layout>
          <Routes>
            {allRoutes.map(({ url, page: Page }, index) => (
              <Route key={index} path={url} element={<Page />} />
            ))}
          </Routes>
        </Layout>
      </SidebarProvider>
    </Router>
  );
}

export default App;
