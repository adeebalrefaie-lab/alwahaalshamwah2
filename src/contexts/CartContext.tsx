import { createContext, useContext, useState, ReactNode } from 'react';
import { UnifiedCartItem } from '../types';

export interface AppliedPromo {
  code: string;
  discountPercentage: number;
}

interface CartContextType {
  cartItems: UnifiedCartItem[];
  notes: string;
  appliedPromo: AppliedPromo | null;
  addToCart: (item: UnifiedCartItem) => void;
  removeFromCart: (instanceId: string) => void;
  clearCart: () => void;
  setNotes: (notes: string) => void;
  getTotalPrice: () => number;
  getItemCount: () => number;
  setAppliedPromo: (promo: AppliedPromo | null) => void;
  getDiscountedTotal: () => { subtotal: number; discountAmount: number; finalTotal: number };
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
  const [appliedPromo, setAppliedPromo] = useState<AppliedPromo | null>(null);

  const addToCart = (item: UnifiedCartItem) => {
    setCartItems((prev) => [...prev, item]);
  };

  const removeFromCart = (instanceId: string) => {
    setCartItems((prev) => prev.filter((item) => item.instanceId !== instanceId));
  };

  const clearCart = () => {
    setCartItems([]);
    setNotes('');
    setAppliedPromo(null);
  };

  const getTotalPrice = () => {
    return cartItems.reduce((sum, item) => sum + item.totalPrice, 0);
  };

  const getItemCount = () => {
    return cartItems.length;
  };

  const getDiscountedTotal = () => {
    const subtotal = getTotalPrice();
    if (!appliedPromo) {
      return { subtotal, discountAmount: 0, finalTotal: subtotal };
    }
    const discountAmount = subtotal * (appliedPromo.discountPercentage / 100);
    const finalTotal = subtotal - discountAmount;
    return { subtotal, discountAmount, finalTotal };
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        notes,
        appliedPromo,
        addToCart,
        removeFromCart,
        clearCart,
        setNotes,
        getTotalPrice,
        getItemCount,
        setAppliedPromo,
        getDiscountedTotal,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
