import { useState } from "react";
import { NavLink } from "react-router-dom";
import { Collapse, UnstyledButton, Group } from "@mantine/core";
import { IconChevronDown } from "@tabler/icons-react";
import "./Sidebar.css";

const Sidebar = () => {
  const [isProductDropdownOpen, setIsProductDropdownOpen] = useState(false);
  const [isBlogDropdownOpen, setIsBlogDropdownOpen] = useState(false);
  const [isAttributeDropdownOpen, setIsAttributeDropdownOpen] = useState(false);
  const [isCategoryDropdownOpen, setIsCategoryDropdownOpen] = useState(false);

  const navItems = [
    { name: "Profile", path: "/admin" },
    { name: "Product Management", path: "/admin/all-products" },
    { name: "Category Management", path: "/admin/manage-categories" },
    { name: "Attribute Management", path: "/admin/manage-attributes" },
    { name: "Blog Management", path: "/admin/all-blogs" },
    { name: "Order Management", path: "/admin/order-management" },
    { name: "Contacts", path: "/admin/contacts" },
    { name: "Reports", path: "/admin/reports" },
  ];

  const productSubItems = [
    { name: "Add New Product", path: "/admin/create-product" },
  ];

  const blogSubItems = [
    { name: "Create New Blog", path: "/admin/create-blog" },
  ];

  const attributeSubItems = [
    { name: "Create New Attribute", path: "/admin/create-attribute" },
  ];

  const categorySubItems = [
    { name: "Create New Category", path: "/admin/create-category" },
  ];

  const isProductManagement = "Product Management";
  const isBlogManagement = "Blog Management";
  const isAttributeManagement = "Attribute Management";
  const isCategoryManagement = "Category Management";

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
                    onClick={() =>
                      setIsProductDropdownOpen(!isProductDropdownOpen)
                    }
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
                          transform: isProductDropdownOpen
                            ? "rotate(180deg)"
                            : "rotate(0deg)",
                          transition: "transform 200ms ease",
                        }}
                      />
                    </Group>
                  </UnstyledButton>

                  <Collapse in={isProductDropdownOpen}>
                    <ul className="sidebar-subnav">
                      {productSubItems.map((subItem) => (
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
              ) : item.name === isAttributeManagement ? (
                <>
                  <UnstyledButton
                    onClick={() =>
                      setIsAttributeDropdownOpen(!isAttributeDropdownOpen)
                    }
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
                          transform: isAttributeDropdownOpen
                            ? "rotate(180deg)"
                            : "rotate(0deg)",
                          transition: "transform 200ms ease",
                        }}
                      />
                    </Group>
                  </UnstyledButton>

                  <Collapse in={isAttributeDropdownOpen}>
                    <ul className="sidebar-subnav">
                      {attributeSubItems.map((subItem) => (
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
              ) : item.name === isCategoryManagement ? (
                <>
                  <UnstyledButton
                    onClick={() =>
                      setIsCategoryDropdownOpen(!isCategoryDropdownOpen)
                    }
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
                          transform: isCategoryDropdownOpen
                            ? "rotate(180deg)"
                            : "rotate(0deg)",
                          transition: "transform 200ms ease",
                        }}
                      />
                    </Group>
                  </UnstyledButton>

                  <Collapse in={isCategoryDropdownOpen}>
                    <ul className="sidebar-subnav">
                      {categorySubItems.map((subItem) => (
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
              ) : item.name === isBlogManagement ? (
                <>
                  <UnstyledButton
                    onClick={() => setIsBlogDropdownOpen(!isBlogDropdownOpen)}
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
                          transform: isBlogDropdownOpen
                            ? "rotate(180deg)"
                            : "rotate(0deg)",
                          transition: "transform 200ms ease",
                        }}
                      />
                    </Group>
                  </UnstyledButton>

                  <Collapse in={isBlogDropdownOpen}>
                    <ul className="sidebar-subnav">
                      {blogSubItems.map((subItem) => (
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
