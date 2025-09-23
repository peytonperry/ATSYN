
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import Header from "./Header";
import "./AppShell.css";

const AppShell = () => {
  return (
    <div className="app-shell">
      <aside className="app-sidebar">

      <Sidebar />
      </aside>


      <div className="app-main">
        <header className="app-header">

        <Header />
        </header>

        <main className="app-content">
          <Outlet /> {/* Route content goes here */}
        </main>
      </div>
    </div>
  );
};

export default AppShell;
