import { useEffect, useRef, useState } from "react";
import "./AllProducts.css";
import { apiService } from "../../../../../config/api";


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
const AllProducts = () => {
    const [Products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [view, setView] = useState<"table" | "card">("card");
    const hasFetched = useRef(false);

    const fetchData = async () => {
        try{
            const data: Product[] = await apiService.get("/Product");
            //console.log(data);
            setProducts(data);
            const sorted = data.sort((a, b) =>
                a.title.localeCompare(b.title, "en", { sensitivity: "base" })
            );

            setProducts(sorted);
            setLoading(false);
        }catch(error){
            console.error("Error fetching products:", error)
            setLoading(false);
        }
    };

    useEffect(() => {
        if (!hasFetched.current) {
            fetchData();
            console.log(Products);
            hasFetched.current = true;
        }
    }, []);

    return (
     <div className="products-page">
      <div className="products-header">

        <div className="view-buttons">
          <button
            onClick={() => setView("card")}
            className={`view-button ${view === "card" ? "active" : ""}`}
          >
            Card View
          </button>
          <button
            onClick={() => setView("table")}
            className={`view-button ${view === "table" ? "active" : ""}`}
          >
            Table View
          </button>
        </div>
      </div>

      {view === "card" ? (
        <div className="products-grid">
          {Products.map((p) => (
            <div key={p.id} className="product-card">
              <img
                src={p.imageUrl || "https://via.placeholder.com/200x200"}
                alt={p.title}
                className="product-image"
              />
              <h2 className="product-name">{p.title}</h2>
              <p className="product-price">${p.price.toFixed(2)}</p>
              <p
                className={`product-stock ${
                  p.stockAmount > 0 ? "in-stock" : "out-of-stock"
                }`}
              >
                {p.stockAmount > 0 ? `${p.stockAmount} in stock` : "Out of stock"}
              </p>
            </div>
          ))}
        </div>
      ) : (
        <table className="w-full border border-gray-200 rounded-lg shadow-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-2 text-left">Name</th>
              <th className="px-4 py-2 text-right">Price</th>
              <th className="px-4 py-2 text-right">Stock</th>
            </tr>
          </thead>
          <tbody>
            {Products.map((p) => (
              <tr key={p.id} className="border-t hover:bg-gray-50">
                <td className="px-4 py-2">{p.title}</td>
                <td className="px-4 py-2 text-right">${p.price.toFixed(2)}</td>
                <td className="px-4 py-2 text-right">
                  {p.stockAmount > 0 ? `${p.stockAmount} in stock` : "Out of stock"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      </div>

    );
}

export default AllProducts;