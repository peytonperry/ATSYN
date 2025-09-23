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
import AdminNavigation from "./pages/admin/AdminNavigation.tsx";

// Admin
import AppShell from "./pages/admin/AppShellComponents/Appshell.tsx"; 
import Dashboard from "./pages/admin/AppShellPages/Dashboard.tsx";
// import Customers from "./pages/admin/Customers.tsx";
// import Reports from "./pages/admin/Reports.tsx";
// import Settings from "./pages/admin/Settings.tsx";

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
        <Route path="/admin" element={<AdminNavigation />} />

        {/* Admin routes wrapped inside AppShell */}
        <Route path="/admin" element={<AppShell />}>
          <Route index element={<Dashboard />} />      
          {/* <Route path="customers" element={<Customers />} />    
          <Route path="reports" element={<Reports />} />
          <Route path="settings" element={<Settings />} /> */}
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