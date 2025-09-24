
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
import { Header } from "./components/Header";
import HomePage from "./pages/Homepage/Homepage.tsx";
import AuthPage from "./pages/Login-Signup-page.tsx";
import ProductPage from "./pages/Products/Product-Page.tsx";
import NavBar from "./components/Navbar.tsx";
import ContactPage from "./pages/Contact-page.tsx";

// Admin Routes 
import AppShell from "./pages/admin/admincomponents/Appshell.tsx"; 
import Dashboard from "./pages/admin/adminpages/Dashboard.tsx";
import Customers from "./pages/admin/adminpages/Customers.tsx";
import Reports from "./pages/admin/adminpages/Reports.tsx";
import Settings from "./pages/admin/adminpages/Settings.tsx";
import ProductManagement from "./pages/admin/adminpages/dashboardpages/ProductManagement.tsx";
import AllProducts from "./pages/admin/adminpages/dashboardpages/pmcomponents/AllProducts.tsx";
import CreateProduct from "./pages/admin/adminpages/dashboardpages/pmcomponents/CreateProduct.tsx";

function AppContent() {
  const location = useLocation();

  const routesWithoutHeader = ["/login", "/signup", "/auth"];

  const shouldHideHeader = routesWithoutHeader.includes(location.pathname);

  if (location.pathname !== "/") {
    import("./index.css");
  }else if (location.pathname == "/"){
    import("./pages/Homepage/Homepage.css")
  }

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
          <Route path="productmanagement" element={<ProductManagement />} />
          <Route path="all-products" element={<AllProducts />} />
          <Route path="create-product" element={<CreateProduct />} />
        </Route>
      </Routes>
    </>
  );
}


function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;
