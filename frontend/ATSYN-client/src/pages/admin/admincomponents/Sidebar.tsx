import { NavLink } from "react-router-dom";
import "./Sidebar.css";

const Sidebar = () =>{

    const navItems = [
        {name: "Profile", path: "/admin"},
        { name: "Product Management", path: "/admin/productmanagement" },
        { name: "Order Management", path: "/admin/order-management" },
        { name: "Reports", path: "/admin/reports" },
    ]



    return (
      <aside className="sidebar">
      <h2 className="sidebar-title">Dashboard</h2>
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