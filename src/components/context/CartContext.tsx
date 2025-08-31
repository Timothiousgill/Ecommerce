import React, { createContext, useReducer, useEffect } from 'react';

// Types for our cart
interface Product {
  id: number;
  title: string;
  price: number;
  image: string;
  rating: {
    rate: number;
    count: number;
  };
  category: string;
  description: string;
}

interface CartItem extends Product {
  quantity: number;
}

interface CartState {
  items: CartItem[];
  totalItems: number;
  totalPrice: number;
}

// Action types for cart operations
type CartAction =
  | { type: 'ADD_TO_CART'; payload: Product }
  | { type: 'REMOVE_FROM_CART'; payload: number } 
  | { type: 'UPDATE_QUANTITY'; payload: { id: number; quantity: number } }
  | { type: 'CLEAR_CART' }
  | { type: 'LOAD_CART'; payload: CartState };

// Context type
interface CartContextType {
  state: CartState;
  addToCart: (product: Product) => void;
  removeFromCart: (productId: number) => void;
  updateQuantity: (productId: number, quantity: number) => void;
  clearCart: () => void;
  getItemQuantity: (productId: number) => number;
}

// Create context
const CartContext = createContext<CartContextType | undefined>(undefined);

// Initial state
const initialState: CartState = {
  items: [],
  totalItems: 0,
  totalPrice: 0,
};

// Calculate totals helper function
const calculateTotals = (items: CartItem[]): { totalItems: number; totalPrice: number } => {
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  return { totalItems, totalPrice };
};

// Save cart to localStorage
const saveCartToStorage = (state: CartState) => {
  try {
    localStorage.setItem('shopping-cart', JSON.stringify(state));
  } catch (error) {
    console.warn('Failed to save cart to localStorage:', error);
  }
};

// Load cart from localStorage
const loadCartFromStorage = (): CartState => {
  try {
    const saved = localStorage.getItem('shopping-cart');
    if (saved) {
      const parsedCart = JSON.parse(saved);
      // Validate the structure
      if (parsedCart && Array.isArray(parsedCart.items)) {
        return parsedCart;
      }
    }
  } catch (error) {
    console.warn('Failed to load cart from localStorage:', error);
  }
  return initialState;
};

// Reducer function - handles all cart operations
const cartReducer = (state: CartState, action: CartAction): CartState => {
  let newState: CartState;
  
  switch (action.type) {
    case 'LOAD_CART':
      return action.payload;

    case 'ADD_TO_CART': {
      const existingItem = state.items.find(item => item.id === action.payload.id);
      
      let newItems: CartItem[];
      if (existingItem) {
        // If item exists, increase quantity
        newItems = state.items.map(item =>
          item.id === action.payload.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        // If new item, add to cart with quantity 1
        newItems = [...state.items, { ...action.payload, quantity: 1 }];
      }
      
      const totals = calculateTotals(newItems);
      newState = {
        items: newItems,
        ...totals,
      };
      break;
    }

    case 'REMOVE_FROM_CART': {
      const newItems = state.items.filter(item => item.id !== action.payload);
      const totals = calculateTotals(newItems);
      newState = {
        items: newItems,
        ...totals,
      };
      break;
    }

    case 'UPDATE_QUANTITY': {
      const { id, quantity } = action.payload;
      
      if (quantity <= 0) {
        // If quantity is 0 or less, remove item
        const newItems = state.items.filter(item => item.id !== id);
        const totals = calculateTotals(newItems);
        newState = {
          items: newItems,
          ...totals,
        };
      } else {
        const newItems = state.items.map(item =>
          item.id === id ? { ...item, quantity } : item
        );
        const totals = calculateTotals(newItems);
        newState = {
          items: newItems,
          ...totals,
        };
      }
      break;
    }

    case 'CLEAR_CART':
      newState = initialState;
      break;

    default:
      return state;
  }

  // Save to localStorage whenever state changes
  saveCartToStorage(newState);
  return newState;
};

// Cart Provider Component
export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, initialState);

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = loadCartFromStorage();
    if (savedCart.items.length > 0) {
      dispatch({ type: 'LOAD_CART', payload: savedCart });
    }
  }, []);

  // Action functions
  const addToCart = (product: Product) => {
    dispatch({ type: 'ADD_TO_CART', payload: product });
  };

  const removeFromCart = (productId: number) => {
    dispatch({ type: 'REMOVE_FROM_CART', payload: productId });
  };

  const updateQuantity = (productId: number, quantity: number) => {
    dispatch({ type: 'UPDATE_QUANTITY', payload: { id: productId, quantity } });
  };

  const clearCart = () => {
    dispatch({ type: 'CLEAR_CART' });
  };

  const getItemQuantity = (productId: number): number => {
    const item = state.items.find(item => item.id === productId);
    return item ? item.quantity : 0;
  };

  const contextValue: CartContextType = {
    state,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getItemQuantity,
  };

  return (
    <CartContext.Provider value={contextValue}>
      {children}
    </CartContext.Provider>
  );
};

export { CartContext };