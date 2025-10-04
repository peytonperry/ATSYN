const ProductManagement = () => {
    //listing products 
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

    return <div>Hi Product Management Page! This page will allow the admin to manage all known products supplied at his store</div>;
}
export default ProductManagement;