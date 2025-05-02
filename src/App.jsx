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

  // Custom logic to match dynamic paths like /users/123/update
  const matchRoute = (pathPattern) => {
    const regex = new RegExp(
      "^" + pathPattern.replace(/:[^/]+/g, "[^/]+") + "$"
    );
    return regex.test(location.pathname);
  };

  const showSidebar = sidebarRoutes.some((path) => matchRoute(path));

  return (
    <div className="app-container">
      {showSidebar && <Sidebar />}
      <div className="main-content">
        <AppRouter />
      </div>
    </div>
  );
}

export default App;
