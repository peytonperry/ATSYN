import React from "react";
import { useCart } from "../../components/Cart/CartContext";
import { apiService } from "../../config/api";
import "./CartPage.css";

const CartPage: React.FC = () => {
  const { state, removeFromCart, updateQuantity, clearCart } = useCart();

  const handleQuantityChange = (productId: number, newQuantity: number) => {
    if (newQuantity < 1) {
      removeFromCart(productId);
    } else {
      updateQuantity(productId, newQuantity);
    }
  };

  const getProductImageUrl = (product: any) => {
    const primaryPhoto = product.photos?.find((p: any) => p.isPrimary) || product.photos?.[0];
    return primaryPhoto
      ? apiService.getImageUrl(primaryPhoto.id)
      : product.imageUrl || "";
  };

  if (state.items.length === 0) {
    return (
      <div className="cart-page">
        <div className="cart-container">
          <div className="cart-header">
            <h1 className="cart-title">Your Cart</h1>
          </div>
          <div className="empty-cart">
            <h3>Your cart is empty.</h3>
            <p>Add some products to get started!</p>
            <a href="/products" className="continue-shopping-btn">
              Continue Shopping
            </a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="cart-page">
      <div className="cart-container">
        <div className="cart-header">
          <h1 className="cart-title">Your Cart</h1>
          <div className="cart-summary">
            <span className="item-count">{state.totalItems} items</span>
            <button className="clear-cart-btn" onClick={clearCart}>
              Clear Cart
            </button>
          </div>
        </div>

        <div className="cart-content">
          <div className="cart-items">
            {state.items.map((item) => {
              const imageUrl = getProductImageUrl(item.product);
              
              return (
                <div key={item.product.id} className="cart-item">
                  <div className="item-image">
                    {imageUrl ? (
                      <img src={imageUrl} alt={item.product.title} />
                    ) : (
                      <div className="image-placeholder">No Image</div>
                    )}
                  </div>

                  <div className="item-details">
                    <h3 className="item-title">{item.product.title}</h3>
                    <div className="item-category">
                      {item.product.category.name}
                    </div>
                    <div className="item-price">
                      <span className="price-symbol">$</span>
                      <span className="price-amount">
                        {item.product.price.toFixed(2)}
                      </span>
                    </div>
                  </div>

                  <div className="item-controls">
                    <div className="quantity-controls">
                      <button
                        className="quantity-btn"
                        onClick={() =>
                          handleQuantityChange(item.product.id, item.quantity - 1)
                        }
                      >
                        -
                      </button>
                      <span className="quantity">{item.quantity}</span>
                      <button
                        className="quantity-btn"
                        onClick={() =>
                          handleQuantityChange(item.product.id, item.quantity + 1)
                        }
                      >
                        +
                      </button>
                    </div>

                    <div className="item-total">
                      <span className="total-label">Total:</span>
                      <span className="total-price">
                        ${(item.product.price * item.quantity).toFixed(2)}
                      </span>
                    </div>

                    <button
                      className="remove-btn"
                      onClick={() => removeFromCart(item.product.id)}
                    >
                      Remove
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="cart-sidebar">
            <div className="order-summary">
              <h3 className="summary-title">Order Summary</h3>

              <div className="summary-breakdown">
                {state.items.map((item) => (
                  <div key={item.product.id} className="summary-item">
                    <span className="summary-item-name">
                      {item.product.title} x{item.quantity}
                    </span>
                    <span className="summary-item-price">
                      ${(item.product.price * item.quantity).toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>

              <div className="summary-divider"></div>

              <div className="summary-totals">
                <div className="summary-row">
                  <span>Subtotal ({state.totalItems} items):</span>
                  <span>${state.totalPrice.toFixed(2)}</span>
                </div>
                <div className="summary-row">
                  <span>Shipping:</span>
                  <span>$5.99</span>
                </div>
                <div className="summary-row">
                  <span>Tax:</span>
                  <span>${(state.totalPrice * 0.08).toFixed(2)}</span>
                </div>
                <div className="summary-divider"></div>
                <div className="summary-row total-row">
                  <span>Total:</span>
                  <span>
                    $
                    {(
                      state.totalPrice +
                      5.99 +
                      state.totalPrice * 0.08
                    ).toFixed(2)}
                  </span>
                </div>
              </div>

              <button className="checkout-btn">Proceed to Checkout</button>

              <a href="/products" className="continue-shopping-link">
                Continue Shopping
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;