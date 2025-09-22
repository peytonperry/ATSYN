import { useEffect, useRef, useState } from "react";
import { apiService } from "../config/api";

interface Category {
  id: number;
  name: string;
}

interface Product {
  id: number;
  title: string;
  description: string;
  price: number;
  categoryId: number;
  stockAmount: number;
  isVisible: boolean;
  shippingTypeId: number;
  inStock: boolean;
  imageUrl: string;
  category: Category;
}

export default function ProductPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const hasFetched = useRef(false);

  // Convert Google Drive share URL to direct image URL
  const convertGoogleDriveUrl = (url: string) => {
    if (url.includes('drive.google.com')) {
      const fileId = url.match(/\/file\/d\/([a-zA-Z0-9_-]+)/)?.[1];
      if (fileId) {
        // Try different formats
        return `https://lh3.googleusercontent.com/d/${fileId}`;
        // Alternative: return `https://drive.google.com/thumbnail?id=${fileId}&sz=w400`;
      }
    }
    return url;
  };

  const handleAddToCart = (product: Product) => {
    // TODO: Implement cart functionality
    console.log('Adding to cart:', product);
    
    // For now, just show an alert - replace with your cart logic
    alert(`Added ${product.title} to cart!`);
    
    // You could also:
    // - Update cart state/context
    // - Call API to add to cart
    // - Show notification toast
    // - Update cart count in navbar
  };

  const fetchData = async () => {
    try {
      const data = await apiService.get("/api/Product");
      console.log(data);
      setProducts(data);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.error("API call failed:", error);
    }
  };

  useEffect(() => {
    if (!hasFetched.current) {
      fetchData();
      hasFetched.current = true;
    }
  }, []);

  if (loading) {
    return (
      <div className="container section">
        <div className="flex-center" style={{ minHeight: '60vh' }}>
          <div className="text-center">
            <h2 className="gradient-text-purple mb-md">Loading Products...</h2>
            <div className="loading-spinner"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container section">
      <div className="text-center mb-xl">
        <h1 className="gradient-text-purple">Our Products</h1>
        <p className="hero-subtitle">Discover our amazing collection</p>
      </div>

      <div className="products-grid">
        {products.map((product) => (
          <div key={product.id} className="product-card">
            {product.imageUrl && (
              <div className="product-image">
                <img 
                  src={convertGoogleDriveUrl(product.imageUrl)} 
                  alt={product.title}
                  onError={(e) => {
                    console.log('Image failed to load:', convertGoogleDriveUrl(product.imageUrl));
                    e.currentTarget.style.display = 'none';
                    const placeholder = document.createElement('div');
                    placeholder.className = 'image-placeholder';
                    placeholder.textContent = 'Image not available';
                    e.currentTarget.parentNode?.appendChild(placeholder);
                  }}
                  onLoad={() => {
                    console.log('Image loaded successfully:', convertGoogleDriveUrl(product.imageUrl));
                  }}
                />
              </div>
            )}
            
            <div className="product-header">
              <h3 className="product-title">{product.title}</h3>
              <div className="product-badges">
                <span className={`badge ${product.inStock ? 'badge-success' : 'badge-danger'}`}>
                  {product.inStock ? 'In Stock' : 'Out of Stock'}
                </span>
                {!product.isVisible && (
                  <span className="badge badge-warning">Hidden</span>
                )}
              </div>
            </div>
            
            {product.description && (
              <p className="product-description">{product.description}</p>
            )}
            
            <div className="product-footer">
              <div className="product-price">
                <span className="price-symbol">$</span>
                <span className="price-amount">{product.price.toFixed(2)}</span>
              </div>
              
              <div className="product-meta">
                <div className="meta-item">
                  <span className="meta-label">Category:</span>
                  <span className="category-badge">{product.category.name}</span>
                </div>
                <div className="meta-item">
                  <span className="meta-label">Stock:</span>
                  <span className="meta-value">{product.stockAmount}</span>
                </div>
              </div>

              <button 
                className={`add-to-cart-btn ${!product.inStock ? 'disabled' : ''}`}
                onClick={() => handleAddToCart(product)}
                disabled={!product.inStock}
              >
                <span className="btn-icon">🛒</span>
                <span className="btn-text">
                  {product.inStock ? 'Add to Cart' : 'Out of Stock'}
                </span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {products.length === 0 && (
        <div className="text-center mt-xl">
          <h3>No products found</h3>
          <p className="mt-sm">Check back later for new products!</p>
        </div>
      )}
    </div>
  );
}