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
import { MantineProvider } from "@mantine/core";

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
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/auth" element={<AuthPage />} />
        <Route path="/login" element={<AuthPage />} />
        <Route path="/signup" element={<AuthPage />} />
        <Route path="/" element={<HomePage />} />
        <Route path="/products" element={<ProductPage />} />
        <Route path="/cart" element={<CartPage />} />
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
      <CartProvider>
        <Router>
          <AppContent />
        </Router>
      </CartProvider>
    </MantineProvider>
  );
}

export default App;
