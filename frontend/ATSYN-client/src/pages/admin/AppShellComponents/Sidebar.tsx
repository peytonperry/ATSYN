import { NavLink } from "react-router-dom";

const Sidebar = () =>{

    const navItems = [
        { label: "Dashboard", to: "/admin/AppShellPages/Dashboard" },
        { label: "Customers", to: "/admin/AppShellPages/Customers" },
        { label: "Reports", to: "/admin/AppShellPages/Reports" },
        { label: "Settings", to: "/admin/AppShellPages/Settings" },
    ]



    return (
      <aside className="w-64 bg-gray-900 text-white p-4">
      <h2 className="text-xl font-bold mb-6">Admin</h2>
      <nav>
        <ul className="space-y-2">
          {navItems.map((item) => (
            <li key={item.label}>
              <NavLink
                to={item.label}
                className={({ isActive }) =>
                  `block px-3 py-2 rounded hover:bg-gray-700 ${
                    isActive ? "bg-gray-700" : ""
                  }`
                }
              >
                {item.to}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
    ) ;
}
export default Sidebar;