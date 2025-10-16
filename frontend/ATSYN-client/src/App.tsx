import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
import HomePage from "./pages/Homepage/Homepage.tsx";
import AuthPage from "./pages/Login-Signup-page.tsx";
import News from "./pages/Newspage/News.tsx";
import NewsDetail from "./pages/Newspage/NewsDetail.tsx";
import Orders from "./pages/Orders/Orders.tsx";
import OrderDetail from "./pages/Orders/OrdersDetail.tsx";
import ProductPage from "./pages/Products/Product-Page.tsx";
import NavBar from "./components/Navbar.tsx";
import ContactPage from "./pages/Contact-page.tsx";
import { CartProvider } from "./components/Cart/CartContext.tsx";
import CartPage from "./pages/Cartpage/CartPage.tsx";
import ProductDetailPage from "./pages/Products/ProductDetail.tsx";
import { MantineProvider } from "@mantine/core";

// Admin Routes
import AppShell from "./pages/admin/admincomponents/Appshell.tsx";
import Dashboard from "./pages/admin/adminpages/Dashboard.tsx";
import Customers from "./pages/admin/adminpages/OrderManagement/Customers.tsx";
import Reports from "./pages/admin/adminpages/Reports.tsx";
import Settings from "./pages/admin/adminpages/Settings.tsx";
import ProductManagement from "./pages/admin/adminpages/dashboardpages/ProductManagement.tsx";
import AllProducts from "./pages/admin/adminpages/dashboardpages/pmcomponents/AllProducts.tsx";
import CreateProduct from "./pages/admin/adminpages/dashboardpages/pmcomponents/CreateProduct.tsx";
import ProductDetailAdminPage from "./pages/admin/adminpages/dashboardpages/pmcomponents/ProductDetailAdminPage.tsx";
import { AuthProvider } from "./components/Auth/AuthContext.tsx";
import { ProtectedRoute } from "./components/ProtectedRoutes.tsx";

function AppContent() {
  const location = useLocation();

  const routesWithoutHeader = ["/login", "/signup", "/auth"];

  const shouldHideHeader = routesWithoutHeader.includes(location.pathname);

  if (location.pathname !== "/") {
    import("./index.css");
  } else if (location.pathname == "/") {
    import("./pages/Homepage/Homepage.css");
  } else if (location.pathname == "/products") {
    import("./pages/Products/ProductPage.css");
  }

  return (
    <>
      {!shouldHideHeader && (
        <>
          <NavBar />
        </>
      )}
      <Routes>
        <Route path="/auth" element={<AuthPage />} />
        <Route path="/login" element={<AuthPage />} />
        <Route path="/signup" element={<AuthPage />} />
        <Route path="/" element={<HomePage />} />
        <Route path="/products" element={<ProductPage />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/product/:id" element={<ProductDetailPage />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/blog" element={<News />} />
        <Route path="/blog/:id" element={<NewsDetail />} />
        <Route path="/orders/" element={<Orders />} />
        <Route path="/orders/:id" element={<OrderDetail />} />
        

        <Route
          path="/admin"
          element={
            <ProtectedRoute requireAdmin>
              <AppShell />
            </ProtectedRoute>
          }
        >
          <Route index element={<Dashboard />} />
          <Route path="Customers" element={<Customers />} />
          <Route path="Reports" element={<Reports />} />
          <Route path="Settings" element={<Settings />} />
          <Route path="productmanagement" element={<ProductManagement />} />
          <Route path="all-products" element={<AllProducts />} />
          <Route path="products/:id" element={<ProductDetailAdminPage />} />
          <Route path="create-product" element={<CreateProduct />} />
        </Route>
      </Routes>
    </>
  );
}

function App() {
  return (
    <MantineProvider
      theme={{
        colors: {
          purple: [
            "#f3e8ff",
            "#e0b8ff",
            "#cb88ff",
            "#b758ff",
            "#a228ff",
            "#8A00C4",
            "#7a00b0",
            "#6a009d",
            "#5a0089",
            "#4a0075",
          ],
        },
        primaryColor: "purple",
        primaryShade: 5,
      }}
      defaultColorScheme="dark"
    >
      <AuthProvider>
        <CartProvider>
          <Router>
            <AppContent />
          </Router>
        </CartProvider>
      </AuthProvider>
    </MantineProvider>
  );
}

export default App;
