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
import Profile from "./pages/profile/profile.tsx";
import NavBar from "./components/Navbar.tsx";
import ContactPage from "./pages/Contact-page.tsx";
import { CartProvider } from "./components/Cart/CartContext.tsx";
import CartPage from "./pages/Cartpage/CartPage.tsx";
import ProductDetailPage from "./pages/Products/ProductDetail.tsx";
import { MantineProvider } from "@mantine/core";
import {ComputerVis} from "./components/CV.tsx";
// Admin Routes
import AppShell from "./pages/admin/admincomponents/Appshell.tsx";
import OrderManagement from "./pages/admin/adminpages/OrderManagement/OrderManagement.tsx";
import OrderManagementDetail from "./pages/admin/adminpages/OrderManagement/OrderDetailPage.tsx";
import PendingOrders from "./pages/admin/adminpages/OrderManagement/PendingOrders.tsx";
import ProcessingOrders from "./pages/admin/adminpages/OrderManagement/ProcessingOrders.tsx";
import ConfirmedOrders from "./pages/admin/adminpages/OrderManagement/ConfirmedOrders.tsx";
import ShippedOrders from "./pages/admin/adminpages/OrderManagement/ShippedOrders.tsx";
import DeliveredOrders from "./pages/admin/adminpages/OrderManagement/DeliveredOrders.tsx";
import ReturnedOrders from "./pages/admin/adminpages/OrderManagement/ReturnedOrders.tsx";
import RefundedOrders from "./pages/admin/adminpages/OrderManagement/RefundedOrders.tsx";
import CancelledOrders from "./pages/admin/adminpages/OrderManagement/CancelledOrders.tsx";
import Reports from "./pages/admin/adminpages/Reports.tsx";
import ProductManagement from "./pages/admin/adminpages/ProductManagement.tsx";
import AllProducts from "./pages/admin/adminpages/AllProducts.tsx";
import CreateProduct from "./pages/admin/adminpages/CreateProduct.tsx";
import ProductDetailAdminPage from "./pages/admin/adminpages/ProductDetailAdminPage.tsx";
import Contacts from "./pages/admin/adminpages/Contacts.tsx"
import { AuthProvider } from "./components/Auth/AuthContext.tsx";
import { ProtectedRoute } from "./components/ProtectedRoutes.tsx";
import AdminProfile from "./pages/admin/adminpages/AdminProfile.tsx";
import CreateNewsForm from "./pages/admin/adminpages/Admin Blog Pages/BlogCreate.tsx";
import AllBlogs from "./pages/admin/adminpages/Admin Blog Pages/AllBlogs.tsx";
import EditBlog from "./pages/admin/adminpages/Admin Blog Pages/EditBlog.tsx";
import { StripeProvider } from "./components/Stripe/StripeProvider.tsx";
import OrderSuccessPage from "./pages/Cartpage/OrderSuccess.tsx";


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
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/blog" element={<News />} />
        <Route path="/blog/:id" element={<NewsDetail />} />
        <Route path="/order-success" element={<OrderSuccessPage />} />
        
        {/* Protected Routes - Require Login */}
        <Route
          path="/orders"
          element={
            <ProtectedRoute>
              <Orders />
            </ProtectedRoute>
          }
        />
        <Route
          path="/orders/:id"
          element={
            <ProtectedRoute>
              <OrderDetail />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />

        {/* Admin Routes */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute requireAdmin>
              <AppShell />
            </ProtectedRoute>
          }
        >
          <Route index element={<AdminProfile />} />
          <Route path="productmanagement" element={<ProductManagement />} />
          <Route path="order-management" element={<OrderManagement />} />
          <Route path="pending-orders" element={<PendingOrders/>}/>
          <Route path = "processing-orders" element={<ProcessingOrders/>}/>
          <Route path = "confirmed-orders" element={<ConfirmedOrders/>}/>
          <Route path = "shipped-orders" element={<ShippedOrders/>}/>
          <Route path = "delivered-orders" element={<DeliveredOrders/>}/>
          <Route path = "returned-orders" element={<ReturnedOrders/>}/>
          <Route path = "refunded-orders" element={<RefundedOrders/>}/>
          <Route path = "cancelled-orders" element={<CancelledOrders/>}/>
          <Route path="order-detail/:id" element = {<OrderManagementDetail />} />
          <Route path="Reports" element={<Reports />} />
          <Route path ="Contacts" element ={<Contacts/>} />
          <Route path="all-products" element={<AllProducts />} />
          <Route path="products/:id" element={<ProductDetailAdminPage />} />
          <Route path="create-product" element={<CreateProduct />} />
          <Route path="all-blogs" element={<AllBlogs/>} />
          <Route path="create-blog" element={<CreateNewsForm />} />
          <Route path="edit-blog/:id" element={<EditBlog />} />
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
        <StripeProvider>
          <CartProvider>
            <Router>
              <ComputerVis></ComputerVis>
              <AppContent />
            </Router>
          </CartProvider>
        </StripeProvider>
      </AuthProvider>
    </MantineProvider>
    
  );
}

export default App;