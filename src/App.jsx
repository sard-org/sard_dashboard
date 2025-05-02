import "./App.css";
import Sidebar from "./components/Sidebar/Sidebar";
import AppRouter from "./routes/AppRouter";
import { useLocation } from "react-router-dom";

function App() {
  const location = useLocation();

  const sidebarRoutes = [
    "/",
    "/categories",
    "/authors",
    "/books",
    "/orders",
  ];

  const matchRoute = (pathPattern) => {
    const regex = new RegExp(
      "^" + pathPattern.replace(/:[^/]+/g, "[^/]+") + "$"
    );
    return regex.test(location.pathname);
  };

  const showSidebar = sidebarRoutes.some((path) => matchRoute(path));

  const isAuthPage = location.pathname === "/auth";

  return (
    <div className="app-container">
      {showSidebar && <Sidebar />}
      <div className={`main-content ${isAuthPage ? "no-padding" : ""}`}>
        <AppRouter />
      </div>
    </div>
  );
}

export default App;