import { useLocation, useNavigate } from "react-router-dom";
import { Button } from '@mantine/core';
import "./Header.css";
//this will display the current page name like Dashboard, Customers, Settings etc
// display a search bar
// admin name 

// type HeaderProps = {
//     settingName: string;
       //will add more props later 

// }

const Header= () => {
    const location = useLocation();
    const navigate = useNavigate();

    const routeTitles: Record<string, string> = {
        "/admin": "Dashboard",
        "/admin/customers": "Customers",
        "/admin/reports": "Reports",
        "/admin/settings": "Settings",
        "/admin/productmanagement": "Product Management",
    };
    const subRouteTitlesPM: Record<string, string> = {
        "/admin/all-products": "View All Products",
        "/admin/create-product": "Add New Product",
    };

    const settingName = routeTitles[location.pathname] || "Admin Panel";



    //need to add logic for subroutes in product management -> add product 

    return (
       <div className="header-container">
        {settingName == 'Product Management' ? (
            <div className= "header-group"> 
            <h1 className="header-title">{settingName + "-"}</h1>
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
                {/* <Button
                    variant="outline"
                    size="sm"
                    radius="md"
                    className="add-product-button"
                    onClick={() => navigate("/admin/all-products")}
                >
                    {subRouteTitlesPM[location.pathname] || "View All Products"}
                </Button> */}
            </div>
        ): (
            <h1 className="header-title">{settingName}</h1>
        )}
        
       </div> 
    );
}
export default Header;
