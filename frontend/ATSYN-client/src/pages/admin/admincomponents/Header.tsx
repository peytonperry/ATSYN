import { Button } from "@mantine/core";
import { useLocation, useNavigate } from "react-router-dom";
import "./Header.css";

const Header= () => {
    const location = useLocation();
    const navigate = useNavigate();

    const routeTitles: Record<string, string> = {
        "/admin": "Dashboard",
        "/admin/customers": "Customers",
        "/admin/reports": "Reports",
        "/admin/settings": "Settings",
        "/admin/productmanagement": "Product Management",
        "/admin/all-products": "View All Products",
        "/admin/create-product": "Add New Product",
    };
    
    const subRouteTitlesPM: Record<string, string> = {
        "/admin/all-products": "View All Products",
        "/admin/create-product": "Add New Product",
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

    // Check if we're in any Product Management related page
    const isProductManagementSection = 
        settingName === 'Product Management' || 
        settingName === 'View All Products' || 
        settingName === 'Add New Product' || 
        settingName === 'Product Details';

    return (
       <div className="header-container">
        {isProductManagementSection ? (
            <div className="header-group"> 
                <button className="pm-subroute-button" onClick={() => navigate("/admin/productmanagement")}>
                    <h1 className="header-title">Product Management -</h1>
                </button>
                {Object.entries(subRouteTitlesPM).map(([path, title]: [string, string]) => (
                    <Button
                        key={path} 
                        variant="outline"
                        size="sm"
                        radius="md"
                        className="add-product-button"
                        onClick={() => navigate(path)}
                    >
                        {title}
                    </Button>
                ))}
            </div>
        ): (
            <h1 className="header-title">{settingName}</h1>
        )}
       </div> 
    );
}
export default Header;
