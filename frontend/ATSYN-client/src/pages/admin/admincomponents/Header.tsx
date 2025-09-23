import { useLocation } from "react-router-dom";
import "./Header";
//this will display the current page name like Dashboard, Customers, Settings etc
// display a search bar
// admin name 

// type HeaderProps = {
//     settingName: string;
       //will add more props later 

// }

const Header= () => {
    const location = useLocation();

    const routeTitles: Record<string, string> = {
        "/admin": "Dashboard",
        "/admin/customers": "Customers",
        "/admin/reports": "Reports",
        "/admin/settings": "Settings",
    };

    const settingName = routeTitles[location.pathname] || "Admin Panel";



    //will add more html content later 

    return <div>{settingName}</div>;
}
export default Header;
