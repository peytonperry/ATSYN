import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
import HomePage from "./pages/Homepage/Homepage.tsx";
import AuthPage from "./pages/Login-Signup-page.tsx";
import ProductPage from "./pages/Products/Product-Page.tsx";
import NavBar from "./components/Navbar.tsx";
import ContactPage from "./pages/Contact-page.tsx";

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
