import { useEffect, useRef, useState } from "react";
import "./ProductPage.css";
import { apiService } from "../../config/api";
import { useCart } from "../../components/Cart/CartContext";
import CartToast from "../../components/Cart/CartToast";
import { Anchor } from "@mantine/core";

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
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [categories, setCategories] = useState<Category[]>([]);
  const hasFetched = useRef(false);
  const [showToast, setShowToast] = useState(false);
  const [toastProduct, setToastProduct] = useState("");

  //search tool
  useEffect(() => {
    let filtered = products;

    if (searchTerm) {
      filtered = filtered.filter(
        (product) =>
          product.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          product.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedCategory) {
      filtered = filtered.filter(
        (product) => product.category.name === selectedCategory
      );
    }

    setFilteredProducts(filtered);
  }, [products, searchTerm, selectedCategory]);

  //fetching products from database
  const fetchData = async () => {
    try {
      const data: Product[] = await apiService.get("/api/Product");
      console.log(data);
      setProducts(data);

      const uniqueCategories: Category[] = Array.from(
        new Map(
          data.map((product: Product) => [
            product.category.id,
            product.category,
          ])
        ).values()
      );
      setCategories(uniqueCategories);

      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.error("API call failed:", error);
    }
  };


  const clearFilters = () => {
    setSearchTerm("");
    setSelectedCategory("");
  };

  useEffect(() => {
    if (!hasFetched.current) {
      fetchData();
      hasFetched.current = true;
    }
  }, []);

  
  const ProductCard = ({ product }: { product: Product }) => {
    //const { addToCart } = useCart();

    /*const handleAddToCart = (product: Product) => {
      addToCart(product);
      setToastProduct(product.title);
      setShowToast(true);
    };*/

    const convertGoogleDriveUrl = (url: string) => {
      if (url.includes("drive.google.com")) {
        const fileId = url.match(/\/file\/d\/([a-zA-Z0-9_-]+)/)?.[1];
        if (fileId) {
          return `https://lh3.googleusercontent.com/d/${fileId}`;
        }
      }
      return url;
    };

    return (
      //Handling images in the card
      <div className="product-card">
        <div className="product-image-container">
          {product.imageUrl ? (
            <img
              src={convertGoogleDriveUrl(product.imageUrl)}
              alt={product.title}
              className="product-image"
              onError={(e) => {
                console.log(
                  "Image failed to load:",
                  convertGoogleDriveUrl(product.imageUrl)
                );
                e.currentTarget.style.display = "none";
                const placeholder =
                  e.currentTarget.parentNode?.querySelector(
                    ".image-placeholder"
                  );
                if (!placeholder) {
                  const newPlaceholder = document.createElement("div");
                  newPlaceholder.className = "image-placeholder";
                  newPlaceholder.textContent = "Image not available";
                  e.currentTarget.parentNode?.appendChild(newPlaceholder);
                }
              }}
              onLoad={() => {
                console.log(
                  "Image loaded successfully:",
                  convertGoogleDriveUrl(product.imageUrl)
                );
              }}
            />
          ) : (
            <div className="image-placeholder">
              <span>No Image Available</span>
            </div>
          )}

          <div className="product-badges">
            <span
              className={`stock-badge ${
                product.inStock ? "in-stock" : "out-of-stock"
              }`}
            >
              {product.inStock ? "In Stock" : "Out of Stock"}
            </span>
            {!product.isVisible && (
              <span className="visibility-badge">Hidden</span>
            )}
          </div>
        </div>

        <div className="product-content">
          <h3 className="product-title">{product.title}</h3>

          {product.description && (
            <p className="product-description">{product.description}</p>
          )}

          <div className="product-meta">
            <div className="product-price">
              <span className="price-symbol">$</span>
              <span className="price-amount">{product.price.toFixed(2)}</span>
            </div>

            <div className="product-info">
              <div className="info-item">
                <span className="info-label">Category:</span>
                <span className="category-tag">{product.category.name}</span>
              </div>
              <div className="info-item">
                <span className="info-label">Stock:</span>
                <span className="stock-count">{product.stockAmount}</span>
              </div>
            </div>
          </div>

          {/*<button
            className={`add-to-cart-btn ${!product.inStock ? "disabled" : ""}`}
            onClick={() => handleAddToCart(product)}
            disabled={!product.inStock}
          >
            <span className="btn-text">
              {product.inStock ? "Add to Cart" : "Out of Stock"}
            </span>
          </button>*/}
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="products-container">
        <div className="loading-section">
          <h2 className="loading-title">Loading Products...</h2>
          <div className="loading-spinner"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="products-container">
      <div className="products-content">
        <div className="products-header">
          <h1 className="products-title">Our Products</h1>

          <div className="filters-section">
            <div className="search-container">
              <input
                type="text"
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-input"
              />
            </div>

            <div className="filter-container">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="category-filter"
              >
                <option value="">All Categories</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.name}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>

            {(searchTerm || selectedCategory) && (
              <button onClick={clearFilters} className="clear-filters-btn">
                Clear Filters
              </button>
            )}
          </div>

          <div className="results-summary">
            <p>
              Showing {filteredProducts.length} of {products.length} products
              {searchTerm && (
                <span>
                  {" "}
                  for "<strong>{searchTerm}</strong>"
                </span>
              )}
              {selectedCategory && (
                <span>
                  {" "}
                  in <strong>{selectedCategory}</strong>
                </span>
              )}
            </p>
          </div>
        </div>

        <div className="products-grid">
          {filteredProducts.map((product) => (
            <Anchor href={`/product/${product.id}`}>
              <ProductCard key={product.id} product={product} />
            </Anchor>
          ))}
        </div>

        {filteredProducts.length === 0 && products.length > 0 && (
          <div className="empty-state">
            <h3>No products found</h3>
            <p>Try adjusting your search or filter criteria</p>
            <button onClick={clearFilters} className="clear-filters-btn">
              Clear Filters
            </button>
          </div>
        )}

        {products.length === 0 && !loading && (
          <div className="empty-state">
            <h3>No products found</h3>
            <p>Check back later for new products!</p>
          </div>
        )}
      </div>
      <CartToast
        show={showToast}
        productName={toastProduct}
        onClose={() => setShowToast(false)}
      />
    </div>
  );
}
