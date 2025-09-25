import { useNavigate } from "react-router-dom";
import "./NavBar.css";
import { useCart } from "./Cart/CartContext";

function NavBar() {
  const navigate = useNavigate();
  const { state } = useCart();

  return (
    <div className="navbar-container">
      <div className="nav-name-container">
        <h2 className="nav-name">ATSYN</h2>
      </div>
      <div className="navbar-center">
        <button className="nav-button" onClick={() => navigate("/")}>
          Home
        </button>
        <button className="nav-button" onClick={() => navigate("/about")}>
          About
        </button>
        <button className="nav-button" onClick={() => navigate("/products")}>
          Products
        </button>
        <button className="nav-button" onClick={() => navigate("/contact")}>
          Contact
        </button>
      </div>

      <div className="navbar-right">
        <button className="nav-button" onClick={() => navigate("/login")}>
          Login/Sign Up
        </button>
        <button className="cart-button" onClick={() => navigate("/cart")}>
          <svg className="cart-icon" viewBox="0 0 24 24">
            <path d="M7 18c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zM1 2v2h2l3.6 7.59-1.35 2.45c-.16.28-.25.61-.25.96 0 1.1.9 2 2 2h12v-2H7.42c-.14 0-.25-.11-.25-.25l.03-.12L8.1 13h7.45c.75 0 1.41-.41 1.75-1.03L21.7 4H5.21l-.94-2H1zm16 16c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z" />
            {state.totalItems > 0 && (
              <span className="cart-badge">{state.totalItems}</span>
            )}
          </svg>
        </button>
      </div>
    </div>
  );
}

export default NavBar;
