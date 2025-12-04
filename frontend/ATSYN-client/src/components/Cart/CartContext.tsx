import React, {
  createContext,
  useContext,
  useReducer,
  useEffect,
  useState,
} from "react";
import type { ReactNode } from "react";

interface Product {
  id: number;
  title: string;
  price: number;
  imageUrl?: string;
  category: {
    name: string;
  };
}

interface CartItem {
  product: Product;
  quantity: number;
  selectedAttributeValueId?: number;
  selectedPrice?: number;
  selectedVariantLabel?: string;
}

interface CartState {
  items: CartItem[];
  totalItems: number;
  totalPrice: number;
}

type CartAction =
  | {
      type: "ADD_TO_CART";
      payload: {
        product: Product;
        quantity: number;
        selectedAttributeValueId?: number;
        selectedPrice?: number;
        selectedVariantLabel?: string;
      };
    }
  | {
      type: "REMOVE_FROM_CART";
      payload: { productId: number; attributeValueId?: number };
    }
  | {
      type: "UPDATE_QUANTITY";
      payload: {
        productId: number;
        quantity: number;
        attributeValueId?: number;
      };
    }
  | { type: "CLEAR_CART" };

interface CartContextType {
  state: CartState;
  addToCart: (
    product: Product,
    quantity: number,
    selectedAttributeValueId?: number,
    selectedPrice?: number,
    selectedVariantLabel?: string
  ) => void;
  removeFromCart: (productId: number, attributeValueId?: number) => void;
  updateQuantity: (
    productId: number,
    quantity: number,
    attributeValueId?: number
  ) => void;
  clearCart: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const CART_STORAGE_KEY = "atsyn-cart";

const calculateTotals = (items: CartItem[]) => {
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = items.reduce((sum, item) => {
    const price = item.selectedPrice ?? item.product.price;
    return sum + price * item.quantity;
  }, 0);
  return { totalItems, totalPrice };
};

const loadInitialCart = (): CartState => {
  try {
    const savedCart = localStorage.getItem(CART_STORAGE_KEY);
    if (savedCart) {
      const items = JSON.parse(savedCart);
      console.log("Loading cart from localStorage:", items);
      const totals = calculateTotals(items);
      return { items, ...totals };
    }
  } catch (error) {
    console.error("Error loading cart from localStorage:", error);
  }
  return { items: [], totalItems: 0, totalPrice: 0 };
};

const cartReducer = (state: CartState, action: CartAction): CartState => {
  switch (action.type) {
    case "ADD_TO_CART": {
      const {
        product,
        quantity = 1,
        selectedAttributeValueId,
        selectedPrice,
        selectedVariantLabel,
      } = action.payload;

      console.log("ADD_TO_CART - Current state:", state.items);
      console.log("ADD_TO_CART - Adding:", {
        product,
        quantity,
        selectedAttributeValueId,
        selectedPrice,
      });

      const existingItem = state.items.find((item) => {
        if (selectedAttributeValueId) {
          return (
            item.product.id === product.id &&
            item.selectedAttributeValueId === selectedAttributeValueId
          );
        }
        return item.product.id === product.id && !item.selectedAttributeValueId;
      });

      console.log("Existing item found:", existingItem);

      let newItems: CartItem[];
      if (existingItem) {
        newItems = state.items.map((item) => {
          if (selectedAttributeValueId) {
            return item.product.id === product.id &&
              item.selectedAttributeValueId === selectedAttributeValueId
              ? { ...item, quantity: item.quantity + quantity }
              : item;
          }
          return item.product.id === product.id &&
            !item.selectedAttributeValueId
            ? { ...item, quantity: item.quantity + quantity }
            : item;
        });
      } else {
        newItems = [
          ...state.items,
          {
            product,
            quantity,
            selectedAttributeValueId,
            selectedPrice,
            selectedVariantLabel,
          },
        ];
      }

      console.log("ADD_TO_CART - New items:", newItems);
      const totals = calculateTotals(newItems);
      return { items: newItems, ...totals };
    }

    case "REMOVE_FROM_CART": {
      const { productId, attributeValueId } = action.payload;

      const newItems = state.items.filter((item) => {
        if (attributeValueId) {
          return !(
            item.product.id === productId &&
            item.selectedAttributeValueId === attributeValueId
          );
        }
        return !(
          item.product.id === productId && !item.selectedAttributeValueId
        );
      });

      const totals = calculateTotals(newItems);
      return { items: newItems, ...totals };
    }

    case "UPDATE_QUANTITY": {
      const { productId, quantity, attributeValueId } = action.payload;

      const newItems = state.items
        .map((item) => {
          if (attributeValueId) {
            return item.product.id === productId &&
              item.selectedAttributeValueId === attributeValueId
              ? { ...item, quantity }
              : item;
          }
          return item.product.id === productId && !item.selectedAttributeValueId
            ? { ...item, quantity }
            : item;
        })
        .filter((item) => item.quantity > 0);

      const totals = calculateTotals(newItems);
      return { items: newItems, ...totals };
    }

    case "CLEAR_CART": {
      return { items: [], totalItems: 0, totalPrice: 0 };
    }

    default:
      return state;
  }
};

export const CartProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [state, dispatch] = useReducer(cartReducer, undefined, loadInitialCart);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    setIsInitialized(true);
  }, []);

  useEffect(() => {
    if (!isInitialized) return;

    console.log("Saving cart to localStorage:", state.items);
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(state.items));
    } catch (error) {
      console.error("Error saving cart to localStorage:", error);
    }
  }, [state.items, isInitialized]);

  const addToCart = (
    product: Product,
    quantity: number = 1,
    selectedAttributeValueId?: number,
    selectedPrice?: number,
    selectedVariantLabel?: string
  ) => {
    dispatch({
      type: "ADD_TO_CART",
      payload: {
        product,
        quantity,
        selectedAttributeValueId,
        selectedPrice,
        selectedVariantLabel,
      },
    });
  };

  const removeFromCart = (productId: number, attributeValueId?: number) => {
    dispatch({
      type: "REMOVE_FROM_CART",
      payload: { productId, attributeValueId },
    });
  };

  const updateQuantity = (
    productId: number,
    quantity: number,
    attributeValueId?: number
  ) => {
    dispatch({
      type: "UPDATE_QUANTITY",
      payload: { productId, quantity, attributeValueId },
    });
  };

  const clearCart = () => {
    dispatch({ type: "CLEAR_CART" });
  };

  return (
    <CartContext.Provider
      value={{
        state,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};
