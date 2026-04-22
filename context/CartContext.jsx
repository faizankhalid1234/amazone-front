'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import api from '../lib/api';

const CartContext = createContext();

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within CartProvider');
  }
  return context;
};

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState({ items: [], total: 0 });
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      fetchCart();
    } else {
      setCart({ items: [], total: 0 });
    }
  }, [user]);

  const fetchCart = async () => {
    try {
      const { data } = await api.get('/cart');
      setCart(data);
    } catch (error) {
      console.error('Error fetching cart:', error);
    }
  };

  const addToCart = async (productId, qty = 1) => {
    if (!user) {
      throw new Error('Please login to add items to cart');
    }
    setLoading(true);
    try {
      const { data } = await api.post('/cart', { productId, qty });
      setCart(data);
      return data;
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const updateCartItem = async (productId, qty) => {
    setLoading(true);
    try {
      const { data } = await api.put(`/cart/${productId}`, { qty });
      setCart(data);
      return data;
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const removeFromCart = async (productId) => {
    setLoading(true);
    try {
      const { data } = await api.delete(`/cart/${productId}`);
      setCart(data);
      return data;
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const clearCart = async () => {
    setLoading(true);
    try {
      await api.delete('/cart');
      setCart({ items: [], total: 0 });
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const value = {
    cart,
    addToCart,
    updateCartItem,
    removeFromCart,
    clearCart,
    loading,
    cartItemsCount: cart.items.reduce((acc, item) => acc + item.qty, 0),
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};
