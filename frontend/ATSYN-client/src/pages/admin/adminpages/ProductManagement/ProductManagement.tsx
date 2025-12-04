//import AllProducts from "./pmcomponents/AllProducts";
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


const ProductManagement = () => {

    //implement a search bar to search for products
    
    //implement a filter to filter products by category, brand, price, etc.

    //implement a sort to sort products by name, price, etc.


    
    return (
        <div >
            {/* have the header add the view all product button, categorize button, and brands button */}
            Hi Product Management Page!
            <div>
                {/* map through products here */}

            </div>
        </div>
    ); 
}
export default ProductManagement;