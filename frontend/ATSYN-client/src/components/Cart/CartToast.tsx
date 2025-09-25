import React, { useState, useEffect } from "react";
import "./CartToast.css";

interface CartToastProps {
  show: boolean;
  productName: string;
  onClose: () => void;
}

const CartToast: React.FC<CartToastProps> = ({
  show,
  productName,
  onClose,
}) => {
  useEffect(() => {
    if (show) {
      const timer = setTimeout(() => {
        onClose();
      }, 3000); // Auto close after 3 seconds

      return () => clearTimeout(timer);
    }
  }, [show, onClose]);

  if (!show) return null;

  return (
    <div className={`cart-toast ${show ? "cart-toast-show" : ""}`}>
      <div className="toast-content">
        <div className="toast-icon">
          <svg viewBox="0 0 24 24" className="check-icon">
            <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" />
          </svg>
        </div>
        <div className="toast-message">
          <div className="toast-title">Added to Cart!</div>
          <div className="toast-product">{productName}</div>
        </div>
        <button className="toast-close" onClick={onClose}>
          <svg viewBox="0 0 24 24">
            <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12 19 6.41z" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default CartToast;
