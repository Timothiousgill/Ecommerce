import { useContext } from "react";
import { CartContext } from "../context/CartContext";

/**
 * Custom hook to use the Cart context
 * Must be used within a CartProvider
 * @returns CartContextType with all cart methods and state
 */
export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};