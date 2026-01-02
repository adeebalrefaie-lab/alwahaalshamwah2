import { createContext, useContext, useState, ReactNode } from 'react';
import { UnifiedCartItem } from '../types';

interface CartContextType {
  cartItems: UnifiedCartItem[];
  notes: string;
  addToCart: (item: UnifiedCartItem) => void;
  removeFromCart: (instanceId: string) => void;
  clearCart: () => void;
  setNotes: (notes: string) => void;
  getTotalPrice: () => number;
  getItemCount: () => number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within CartProvider');
  }
  return context;
};

interface CartProviderProps {
  children: ReactNode;
}

export const CartProvider = ({ children }: CartProviderProps) => {
  const [cartItems, setCartItems] = useState<UnifiedCartItem[]>([]);
  const [notes, setNotes] = useState('');

  const addToCart = (item: UnifiedCartItem) => {
    setCartItems((prev) => [...prev, item]);
  };

  const removeFromCart = (instanceId: string) => {
    setCartItems((prev) => prev.filter((item) => item.instanceId !== instanceId));
  };

  const clearCart = () => {
    setCartItems([]);
    setNotes('');
  };

  const getTotalPrice = () => {
    return cartItems.reduce((sum, item) => sum + item.totalPrice, 0);
  };

  const getItemCount = () => {
    return cartItems.length;
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        notes,
        addToCart,
        removeFromCart,
        clearCart,
        setNotes,
        getTotalPrice,
        getItemCount,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
