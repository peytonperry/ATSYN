import { useEffect, useRef, useState } from "react";
import "./CreateProduct.css";
import { apiService } from "../../../../../config/api";
import {CategorySelect} from "./CategorySelect";



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
const CreateProduct: React.FC = () => {
    const [formData, setFormData] = useState({
        title: "",
        description: "",
        price: 0,
        categoryId: 0,
        stockAmount: 0,
        isVisible: true,
        shippingTypeId: 0,
        imageUrl: "",
        category: { id: 0, name: "" }
    });

    const [loading, setLoading] = useState(false);
    const [ successMsg, setSuccessMsg] = useState("");
    const [ errorMsg, setErrorMsg] = useState("");
    const [categories, setCategories] = useState<Category[]>([]);

    useEffect(() => {
         const fetchCategories = async () => {
        try {
            const response = await apiService.get("/Category");
            const fetchedCategories: Category[] = response || [];
            console.log("Fetched categories:", fetchedCategories);
            setCategories(fetchedCategories);
        } catch (error) {
            console.error("Error fetching categories:", error);
            setCategories([]); 
        }
        };
        fetchCategories();
    }, []);

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
    ) => {
            const { name, value, type } = e.target;

            setFormData({
                ...formData,
                [name]: type === "checkbox"
                    ? (e.target as HTMLInputElement).checked 
                    : value
            });
        console.log("Form data being sent:", formData);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setErrorMsg("");
        setSuccessMsg("");

        const test = {
        ...formData,
        price: Number(formData.price),
        stockAmount: Number(formData.stockAmount)
        };
        console.log("Form data being sent:", test);
        
        try {
            
            const response: Product = await apiService.post("/api/Product", test);
            
            console.log("Created product:", response);

            setSuccessMsg(`Product "${response.title}" created successfully!`);

            setFormData({
                title: "",
                description: "",
                price: 0,
                categoryId: 0,
                stockAmount: 0,
                isVisible: true,
                shippingTypeId: 0,
                imageUrl: "",
                category: { id: 0, name: "" }
            });
            console.log("Form data being sent:", formData);

        } catch (error) {
            console.error("Error creating product:", error);
            setErrorMsg("Failed to create product. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="create-product-container">
            <h2 className="create-product-title">Create Product</h2>

            <form onSubmit={handleSubmit} className="create-product-form">
                <div className="form-group">
                    <label>Title</label>
                    <input
                        type="text"
                        name="title"
                        value={formData.title}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="form-group">
                    <label>Description</label>
                    <textarea
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="form-row">
                    <div className="form-group">
                        <label>Price</label>
                        <input
                            type="number"
                            name="price"
                            value={formData.price}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>Stock</label>
                        <input
                            type="number"
                            name="stockAmount"
                            value={formData.stockAmount}
                            onChange={handleChange}
                            required
                        />
                    </div>
                </div>
                    <div className="form-group">
                        <label>Category</label>
                        <CategorySelect 
                            categories={categories} 
                            onCategoryChange={(category) => 
                                setFormData({...formData, categoryId: category.id, category: category})} 
                            onCategoryCreate={async (newCategoryName) => {
                                console.log("New category to create:", newCategoryName);
                                const response = await apiService.post("/api/Category", { name: newCategoryName,});
                                const createdCategory: Category = response;
                                setCategories((prev) => [...prev, createdCategory])
                                return createdCategory;
                            }} 
                        />
                    </div>

                <div className="form-group">
                    <label>Image URL</label>
                    <input
                        type="url"
                        name="imageUrl"
                        value={formData.imageUrl}
                        onChange={handleChange}
                    />
                </div>

                <div className="checkbox-group">
                    <input
                        type="checkbox"
                        name="isVisible"
                        checked={formData.isVisible}
                        onChange={handleChange}
                    />
                    <label>Visible</label>
                </div>

                <div className="checkbox-group">
                    <input
                        type="checkbox"
                        name="inStock"
                        checked={formData.stockAmount > 0}
                        onChange={handleChange}
                        disabled
                    />
                    <label>In Stock</label>
                </div>

                <button type="submit" disabled={loading} className="submit-btn">
                    {loading ? "Creating..." : "Create Product"}
                </button>
            </form>

            {successMsg && <p className="success-msg">{successMsg}</p>}
            {errorMsg && <p className="error-msg">{errorMsg}</p>}
        </div>
    );
};

export default CreateProduct;