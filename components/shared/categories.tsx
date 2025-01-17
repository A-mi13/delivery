"use client";

import { cn } from "@/lib/utils";
import React, { useState } from "react";
import { categories, products } from "@/prisma/constants";
import ProductModal from "./ProductModal";
import { Product } from "@prisma/client";
import { useCart } from "@/components/shared/CartContext"; // Импортируем контекст корзины

const categoryColors: { [key: number]: string } = {
  1: "bg-red-500",
  2: "bg-green-500",
  3: "bg-blue-500",
  4: "bg-yellow-500",
  5: "bg-purple-500",
};

type Props = {
  className?: string;
};

export const Categories: React.FC<Props> = ({ className }) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const { cart, addToCart, increaseCount, decreaseCount } = useCart(); // Используем контекст корзины

  const activeCategoryId = activeIndex + 1;
  const activeProducts = products.filter(
    (product) => product.categoryId === activeCategoryId
  );

  const handleProductClick = (product: Product) => {
    setSelectedProduct(product);
  };

  const closeModal = () => {
    setSelectedProduct(null);
  };

  return (
    <div className="max-w-[430px] mx-auto p-4">
      <div
        className={cn(
          "inline-flex max-w-[400px] gap-1 overflow-x-auto whitespace-nowrap",
          className
        )}
        style={{
          scrollbarWidth: "none",
          msOverflowStyle: "none",
        }}
      >
        {categories.map((cat, index) => (
          <a
            key={index}
            className={cn(
              "flex items-center font-bold h-11 cursor-pointer",
              index === 0 ? "px-0" : "px-2",
              activeIndex === index ? "text-primary" : "text-gray-500"
            )}
            onClick={() => setActiveIndex(index)}
          >
            {cat.name}
          </a>
        ))}
      </div>

      <div className="pb-24 grid grid-cols-2 gap-4 mt-4">
        {activeProducts.map((product) => (
          <div
            key={product.id}
            className={cn(
              "flex flex-col justify-between p-2 h-[240px] rounded-lg text-white relative cursor-pointer",
              categoryColors[activeCategoryId] || "bg-gray-500"
            )}
            onClick={() => handleProductClick(product)} // Открытие модалки
          >
            <img
              src={product.imageUrl}
              alt={product.name}
              className="w-[175px] h-[120px] object-cover rounded-md"
            />
            {product.price && <p className="mt-1">{product.price}₽</p>}
            <h3 className="font-bold text-[14px]">{product.name}</h3>

            {cart[product.id] ? (
              <div className="flex items-center justify-center mt-auto">
                <div
                  className={`flex items-center text-white p-1 rounded-full w-full max-w-xs justify-center transition-colors duration-500 ease-in-out ${cart[product.id].count > 0 ? "bg-[#70B9BE]" : "bg-[#F5F5F5]"}`}
                >
                  <button
                    className="text-white px-2"
                    onClick={(e) => {
                      e.stopPropagation();
                      decreaseCount(product.id);
                    }}
                  >
                    -
                  </button>
                  <span className="mx-2">{cart[product.id].count}</span>
                  <button
                    className="text-white px-2"
                    onClick={(e) => {
                      e.stopPropagation();
                      increaseCount(product.id);
                    }}
                  >
                    +
                  </button>
                </div>
              </div>
            ) : (
              <button
                className="mt-auto bg-[#F5F5F5] text-[#70B9BE] p-1 rounded-full w-full transition-colors duration-500 ease-in-out"
                onClick={(e) => {
                  e.stopPropagation();
                  addToCart(product.id);
                }}
              >
                +
              </button>
            )}
          </div>
        ))}
      </div>

      {selectedProduct && (
        <ProductModal
          product={selectedProduct}
          onClose={closeModal}
          cart={cart}
          handleAddToCart={addToCart}
          handleIncrease={increaseCount}
          handleDecrease={decreaseCount}
        />
      )}
    </div>
  );
};