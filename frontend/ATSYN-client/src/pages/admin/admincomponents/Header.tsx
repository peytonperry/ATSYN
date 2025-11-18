import { Button } from "@mantine/core";
import { useLocation, useNavigate } from "react-router-dom";
import "./Header.css";

const Header= () => {
    const location = useLocation();
    const navigate = useNavigate();

    const routeTitles: Record<string, string> = {
        "/admin": "Dashboard",
        "/admin/reports": "Reports",
        "/admin/contacts": "Contacts",
        "/admin/productmanagement": "Product Management",
        "/admin/all-products": "View All Products",
        "/admin/create-product": "Add New Product",
        "/admin/order-management": "Order Management",
        "/admin/all-blogs": "Blog Management",
        "/admin/create-blog": "Create Blog",
        "/admin/processing-orders": "Processing Orders",
        "/admin/pending-orders": "Pending Orders",
        "/admin/confirmed-orders": "Confirmed Orders",
        "/admin/shipped-orders": "Shipped Orders",
        "/admin/delivered-orders": "Delivered Orders",
        "/admin/returned-orders": "Returned Orders",
        "/admin/refunded-orders": "Refunded Orders",
        "/admin/cancelled-orders": "Cancelled Orders",
    };
    

    const isProductDetailPage = () => {
        return /^\/admin\/products\/\d+$/.test(location.pathname);
    };
    const isOrderDetailPage = () => {
        return /^\/admin\/order-detail\/\d+$/.test(location.pathname);
    };
    const isBlogDetailPage = () => {
        return /^\/admin\/edit-blog\/\d+$/.test(location.pathname)
    }

    const getSettingName = () => {
        if (isProductDetailPage()) {
            return "Product Details";
        } 

        if(isOrderDetailPage()){
            return "Order Details"
        }
        if(isBlogDetailPage()){
            return "Blog Details"
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
