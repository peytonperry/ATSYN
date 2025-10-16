import { Button } from "@mantine/core";
import { useLocation, useNavigate } from "react-router-dom";
import "./Header.css";

const Header= () => {
    const location = useLocation();
    const navigate = useNavigate();

    const routeTitles: Record<string, string> = {
        "/admin": "Dashboard",
        "/admin/reports": "Reports",
        "/admin/productmanagement": "Product Management",
        "/admin/all-products": "View All Products",
        "/admin/create-product": "Add New Product",
        "/admin/order-management": "Order Management",
    };
    

    const isProductDetailPage = () => {
        return /^\/admin\/products\/\d+$/.test(location.pathname);
    };

    const getSettingName = () => {
        if (isProductDetailPage()) {
            return "Product Details";
        }
        return routeTitles[location.pathname] || "Admin Panel";
    };

    const settingName = getSettingName();

    return (
       <div className="header-container">
            <h1 className="header-title">{settingName}</h1>

       </div> 
    );
}
export default Header;
