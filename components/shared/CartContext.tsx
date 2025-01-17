"use client";

import React, { createContext, useContext, useEffect, useState } from "react";

interface CartItem {
  id: number;
  count: number;
}

interface CartContextProps {
  cart: Record<number, CartItem>;
  addToCart: (id: number) => void;
  increaseCount: (id: number) => void;
  decreaseCount: (id: number) => void;
  isLoading: boolean;
}

const CartContext = createContext<CartContextProps | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cart, setCart] = useState<Record<number, CartItem>>({});
  const [isLoading, setIsLoading] = useState(true);

  // Загрузка корзины с сервера при монтировании
  useEffect(() => {
    const fetchCart = async () => {
      try {
        const response = await fetch("/api/cart?userId=1"); // Фиксированный userId
        if (!response.ok) {
          throw new Error(`Failed to fetch cart: ${response.statusText}`);
        }

        const data = await response.json();
        console.log("Cart data from server:", data); // Логирование для отладки

        if (data && Array.isArray(data.items)) {
          const cartItems = data.items.reduce((acc: Record<number, CartItem>, item: any) => {
            if (item.productItemId && item.quantity) {
              acc[item.productItemId] = { id: item.productItemId, count: item.quantity };
            }
            return acc;
          }, {});
          setCart(cartItems);
        } else {
          console.error("Invalid cart data format:", data);
          setCart({}); // Устанавливаем пустую корзину, если данные некорректны
        }
      } catch (error) {
        console.error("Failed to fetch cart:", error);
        setCart({}); // Устанавливаем пустую корзину в случае ошибки
      } finally {
        setIsLoading(false);
      }
    };

    fetchCart();
  }, []);

  const addToCart = async (id: number) => {
    try {
      const response = await fetch("/api/cart/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId: id, quantity: 1, userId: 1 }), // Фиксированный userId
      });

      if (!response.ok) {
        throw new Error("Failed to add to cart");
      }

      // Обновляем состояние корзины
      setCart((prev) => ({
        ...prev,
        [id]: prev[id] ? { ...prev[id], count: prev[id].count + 1 } : { id, count: 1 },
      }));
    } catch (error) {
      console.error("Failed to add to cart:", error);
    }
  };

  const increaseCount = async (id: number) => {
    try {
      const response = await fetch("/api/cart/increase", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId: id, userId: 1 }), // Фиксированный userId
      });

      if (!response.ok) {
        throw new Error("Failed to increase count");
      }

      // Обновляем состояние корзины
      setCart((prev) => ({
        ...prev,
        [id]: { ...prev[id], count: prev[id].count + 1 },
      }));
    } catch (error) {
      console.error("Failed to increase count:", error);
    }
  };

  const decreaseCount = async (id: number) => {
    try {
      const response = await fetch("/api/cart/decrease", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId: id, userId: 1 }), // Фиксированный userId
      });
  
      if (!response.ok) {
        throw new Error("Failed to decrease count");
      }
  
      // После успешного запроса обновляем состояние корзины
      const updatedCartResponse = await fetch("/api/cart?userId=1");
      if (!updatedCartResponse.ok) {
        throw new Error("Failed to fetch updated cart");
      }
  
      const updatedCartData = await updatedCartResponse.json();
      if (updatedCartData && Array.isArray(updatedCartData.items)) {
        const updatedCart = updatedCartData.items.reduce((acc: Record<number, CartItem>, item: any) => {
          if (item.productItemId && item.quantity) {
            acc[item.productItemId] = { id: item.productItemId, count: item.quantity };
          }
          return acc;
        }, {});
        setCart(updatedCart);
      }
    } catch (error) {
      console.error("Failed to decrease count:", error);
    }
  };

  return (
    <CartContext.Provider value={{ cart, addToCart, increaseCount, decreaseCount, isLoading }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};