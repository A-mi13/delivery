import React, { useState } from "react";
import { ProductCard } from "./ProductСard";   // Импортируем компонент карточки товара
import ProductModal from "./ProductModal"; // Импортируем компонент модального окна

const ProductsGroup: React.FC = () => {
  const [productQuantity, setProductQuantity] = useState<{ [key: number]: number }>({});
  const [selectedProductId, setSelectedProductId] = useState<number | null>(null);

  const handleIncreaseQuantity = (id: number) => {
    setProductQuantity((prev) => ({
      ...prev,
      [id]: (prev[id] || 0) + 1,
    }));
  };

  const handleDecreaseQuantity = (id: number) => {
    setProductQuantity((prev) => ({
      ...prev,
      [id]: Math.max((prev[id] || 0) - 1, 0),
    }));
  };

  const products = [
    { id: 1, name: "Продукт 1", price: 200, imageUrl: "/image1.jpg" },
    { id: 2, name: "Продукт 2", price: 300, imageUrl: "/image2.jpg" },
    // Другие продукты
  ];

  return (
    <div>
      {products.map((product) => (
        <ProductCard
          key={product.id}
          id={product.id}
          name={product.name}
          price={product.price}
          imageUrl={product.imageUrl}
          quantity={productQuantity[product.id] || 0}
          onIncreaseQuantity={handleIncreaseQuantity}
          onDecreaseQuantity={handleDecreaseQuantity}
          onOpenModal={() => setSelectedProductId(product.id)}
        />
      ))}

      {selectedProductId && (
        <ProductModal
          productId={selectedProductId}
          onClose={() => setSelectedProductId(null)}
          quantity={productQuantity[selectedProductId] || 0}
          onIncreaseQuantity={handleIncreaseQuantity}
          onDecreaseQuantity={handleDecreaseQuantity}
        />
      )}
    </div>
  );
};

export default ProductsGroup;
