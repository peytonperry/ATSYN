import { useState } from "react";
import { NavLink } from "react-router-dom";
import { Collapse, UnstyledButton, Group, Text } from "@mantine/core";
import { IconChevronDown } from "@tabler/icons-react";
import CreateNewsForm from "../adminpages/BlogCreate";
import "./Sidebar.css";

const Sidebar = () => {
  const [isProductDropdownOpen, setIsProductDropdownOpen] = useState(false);

  const navItems = [
    { name: "Profile", path: "/admin" },
    { name: "Product Management", path: "/admin/all-products" },
    { name: "Order Management", path: "/admin/order-management" },
    { name: "Contacts", path: "/admin/contacts" },
    {name: "Reports", path: "/admin/reports"},
    {name: "Blog", path: "/admin/blogs"},
  ];

  const navSubItems = [
    { name: "Add New Product", path: "/admin/create-product" }
  ];

  const isProductManagement = "Product Management";

  return (
    <aside className="sidebar">
      <h2 className="sidebar-title">Dashboard</h2>
      <nav>
        <ul className="sidebar-nav">
          {navItems.map((item) => (
            <li key={item.name} className="sidebar-itemNew">
              {item.name === isProductManagement ? (
                <>
                  <UnstyledButton
                    onClick={() => setIsProductDropdownOpen(!isProductDropdownOpen)}
                    style={{ width: "100%" }}
                  >
                    <Group justify="space-between">
                      <NavLink
                        to={item.path}
                        className={({ isActive }) =>
                          `sidebar-link ${isActive ? "active" : ""}`
                        }
                        style={{ flex: 1 }}
                      >
                        {item.name}
                      </NavLink>
                      <IconChevronDown
                        size={16}
                        style={{
                          transform: isProductDropdownOpen ? "rotate(180deg)" : "rotate(0deg)",
                          transition: "transform 200ms ease",
                        }}
                      />
                    </Group>
                  </UnstyledButton>

                  <Collapse in={isProductDropdownOpen}>
                    <ul className="sidebar-subnav">
                      {navSubItems.map((subItem) => (
                        <li key={subItem.name} className="sidebar-subitem">
                          <NavLink
                            to={subItem.path}
                            className={({ isActive }) =>
                              `sidebar-sublink ${isActive ? "active" : ""}`
                            }
                          >
                            {subItem.name}
                          </NavLink>
                        </li>
                      ))}
                    </ul>
                  </Collapse>
                </>
              ) : (
                <NavLink
                  to={item.path}
                  className={({ isActive }) =>
                    `sidebar-link ${isActive ? "active" : ""}`
                  }
                >
                  {item.name}
                </NavLink>
              )}
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;

            // <li key={item.name} className="sidebar-item">
            //   <NavLink
            //     to={item.path}
            //     className={({ isActive }) =>
            //       `sidebar-link ${isActive ? "active" : ""}`
            //     }
            //   >
            //     {item.name}
            //   </NavLink>
            // </li>