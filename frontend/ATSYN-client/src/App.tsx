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
import { CartProvider } from "./components/Cart/CartContext.tsx";
import CartPage from "./pages/Cartpage/CartPage.tsx";
import ProductDetailPage from "./pages/Products/ProductDetail.tsx";

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
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/auth" element={<AuthPage />} />
        <Route path="/login" element={<AuthPage />} />
        <Route path="/signup" element={<AuthPage />} />
        <Route path="/" element={<HomePage />} />
        <Route path="/products" element={<ProductPage />} />
        <Route path="/cart" element={<CartPage/>} />
        <Route path="/product/:id" element={<ProductDetailPage/>} />
      </Routes>
    </>
  );
}

function App() {
  return (
    <CartProvider>
    <Router>
      <AppContent />
    </Router>
    </CartProvider>
  );
}

export default App;
