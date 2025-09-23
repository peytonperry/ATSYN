import { NavLink } from "react-router-dom";
import "./Sidebar.css";

const Sidebar = () =>{

    const navItems = [
        { name: "Dashboard", path: "/admin" },
        { name: "Customers", path: "/admin/customers" },
        { name: "Reports", path: "/admin/reports" },
        { name: "Settings", path: "/admin/settings" },
    ]



    return (
      <aside className="sidebar">
      <h2 className="sidebar-title">Admin</h2>
      <nav>
        <ul className="sidebar-nav">
          {navItems.map((item) => (
            <li key={item.name} className="sidebar-item">
              <NavLink
                to={item.path}
                className={({ isActive }) =>
                  `sidebar-link ${isActive ? "active" : ""}`
                }
              >
                {item.name}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
    ) ;
}
export default Sidebar;