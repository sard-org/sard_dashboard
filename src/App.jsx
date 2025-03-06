import "./App.css";
import Sidebar from "./components/Sidebar/Sidebar";
import AppRouter from "./routes/AppRouter";

function App() {
  return (
    <div className="app-container">
      <Sidebar />
      <div className="main-content">
        <AppRouter />
      </div>
    </div>
  );
}

export default App;
