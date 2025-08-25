import React, { createContext, useContext, useEffect, useState } from 'react';
import { CartItem, Product } from '@/lib/types';
import { apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';

interface CartContextType {
  cartItems: CartItem[];
  cartCount: number;
  cartTotal: number;
  addToCart: (product: Product, quantity?: number) => Promise<void>;
  updateQuantity: (cartItemId: number, quantity: number) => Promise<void>;
  removeFromCart: (cartItemId: number) => Promise<void>;
  clearCart: () => Promise<void>;
  isLoading: boolean;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

// Temporary user ID for demo purposes (in a real app, this would come from authentication)
const TEMP_USER_ID = 1;

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const fetchCart = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`/api/cart/${TEMP_USER_ID}`);
      if (!response.ok) throw new Error('Failed to fetch cart');
      const data = await response.json();
      setCartItems(data);
    } catch (error) {
      console.error('Error fetching cart:', error);
      toast({
        title: "Error",
        description: "Failed to load your shopping cart. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  
  const cartTotal = cartItems.reduce((sum, item) => {
    const price = item.product?.price || 0;
    return sum + (price * item.quantity);
  }, 0);

  const addToCart = async (product: Product, quantity = 1) => {
    try {
      setIsLoading(true);
      const response = await apiRequest('POST', '/api/cart', {
        userId: TEMP_USER_ID,
        productId: product.id,
        quantity
        // Let the server handle the addedAt timestamp
      });
      
      if (response.ok) {
        const newItem = await response.json();
        setCartItems(prev => [...prev, newItem]);
        toast({
          title: "Added to cart",
          description: `${product.title} has been added to your cart`,
        });
      }
    } catch (error) {
      console.error('Error adding to cart:', error);
      toast({
        title: "Error",
        description: "Failed to add item to cart. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const updateQuantity = async (cartItemId: number, quantity: number) => {
    try {
      setIsLoading(true);
      const response = await apiRequest('PATCH', `/api/cart/${cartItemId}`, { quantity });
      
      if (response.ok) {
        const updatedItem = await response.json();
        setCartItems(prev => 
          prev.map(item => item.id === cartItemId ? updatedItem : item)
        );
      }
    } catch (error) {
      console.error('Error updating cart:', error);
      toast({
        title: "Error",
        description: "Failed to update quantity. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const removeFromCart = async (cartItemId: number) => {
    try {
      setIsLoading(true);
      const response = await apiRequest('DELETE', `/api/cart/${cartItemId}`, undefined);
      
      if (response.ok) {
        setCartItems(prev => prev.filter(item => item.id !== cartItemId));
        toast({
          title: "Removed from cart",
          description: "Item has been removed from your cart",
        });
      }
    } catch (error) {
      console.error('Error removing from cart:', error);
      toast({
        title: "Error",
        description: "Failed to remove item from cart. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const clearCart = async () => {
    try {
      setIsLoading(true);
      const response = await apiRequest('DELETE', `/api/cart/user/${TEMP_USER_ID}`, undefined);
      
      if (response.ok) {
        setCartItems([]);
        toast({
          title: "Cart cleared",
          description: "All items have been removed from your cart",
        });
      }
    } catch (error) {
      console.error('Error clearing cart:', error);
      toast({
        title: "Error",
        description: "Failed to clear cart. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <CartContext.Provider value={{
      cartItems,
      cartCount,
      cartTotal,
      addToCart,
      updateQuantity,
      removeFromCart,
      clearCart,
      isLoading
    }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
