import { Header } from "./components/Header";

import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
import HomePage from "./pages/Homepage";
import AuthPage from "./pages/Login-Signup-page.tsx";
import ProductPage from "./pages/Products/Product-Page.tsx";
import NavBar from './components/Navbar.tsx'

// Admin
import AppShell from "./pages/admin/admincomponents/Appshell.tsx"; 
import Dashboard from "./pages/admin/adminpages/Dashboard.tsx";
import Customers from "./pages/admin/adminpages/Customers.tsx";
import Reports from "./pages/admin/adminpages/Reports.tsx";
import Settings from "./pages/admin/adminpages/Settings.tsx";

function AppContent() {
  const location = useLocation();

  const routesWithoutHeader = ["/login", "/signup", "/auth"];

  const shouldHideHeader = routesWithoutHeader.includes(location.pathname);

  return (
    <>
      {!shouldHideHeader && (
        <>
          {/* <Header callToActionTitle="Get Started" callToActionUrl="/signup" /> */}
          <NavBar />
        </>
      )}
      <Routes>
        <Route path="/auth" element={<AuthPage />} /> 
        <Route path="/login" element={<AuthPage />} />
        <Route path="/signup" element={<AuthPage />} />
        <Route path="/" element={<HomePage />} />
        <Route path="/products" element={<ProductPage/>}/>

        <Route path="/admin" element={<AppShell />}>
          <Route index element={<Dashboard />} />      
          <Route path="Customers" element={<Customers />} />    
          <Route path="Reports" element={<Reports />} />
          <Route path="Settings" element={<Settings />} />
        </Route>
      </Routes>
    </>
  );
}

//*Use this structure for nested routes for the admin panel 

        // <Route path="/admin" element={<AppShell />}>
        //   <Route index element={<Dashboard />} /> {/* /admin */}
        //   <Route path="users" element={<Users />} /> {/* /admin/users */}
        //   <Route path="reports" element={<Reports />} /> {/* /admin/reports */}
        //   <Route path="settings" element={<Settings />} /> {/* /admin/settings */}
        // </Route>

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;