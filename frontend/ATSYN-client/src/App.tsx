import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
import { Header } from "./components/Header";
import HomePage from "./pages/Homepage";
import AuthPage from "./pages/Login-Signup-page.tsx";
import NavBar from './components/Navbar.tsx'
import ProductPage from "./pages/productPage.tsx";

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
        <Route path="/productpage" element={<ProductPage/>}/>
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
