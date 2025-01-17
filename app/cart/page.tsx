"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/components/shared/CartContext";

const categoryColors: { [key: number]: string } = {
  1: "bg-red-500",
  2: "bg-green-500",
  3: "bg-blue-500",
  4: "bg-yellow-500",
  5: "bg-purple-500",
};

const CartPage = () => {
  const router = useRouter();
  const { cart, isLoading, increaseCount, decreaseCount } = useCart();
  const [promoCode, setPromoCode] = useState("");
  const [deliveryPrice] = useState(50);
  const [products, setProducts] = useState<any[]>([]);

  // Загрузка всех продуктов
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch("/api/products");
        if (!response.ok) {
          throw new Error("Failed to fetch products");
        }
        const data = await response.json();
        setProducts(data);
      } catch (error) {
        console.error("Failed to fetch products:", error);
      }
    };

    fetchProducts();
  }, []);

  if (isLoading) {
    return <div>Загрузка корзины...</div>;
  }

  const totalItems = Object.values(cart).reduce((sum, item) => sum + item.count, 0);
  const totalPrice = Object.values(cart).reduce((sum, item) => {
    const product = products.find((p) => p.id === item.id);
    return sum + item.count * (product?.price || 0); // Используем реальную цену товара
  }, 0);

  const handleGoHome = () => {
    window.location.href = "/";
  };

  return (
    <div className="p-4 max-w-[430px] mx-auto relative flex flex-col h-screen">
      <div className="absolute top-4 left-4">
        <button onClick={handleGoHome} className="text-blue-500 text-lg">
          &#x2190; Вернуться на главную
        </button>
      </div>

      <h1 className="text-2xl font-bold mb-4 mt-16">Корзина</h1>

      <div className="space-y-4">
        {Object.entries(cart).map(([id, item]) => {
          const product = products.find((p) => p.id === Number(id));
          if (!product) return null;

          return (
            <div
              key={id}
              className={`flex justify-between items-center p-4 rounded-lg text-white ${categoryColors[product.categoryId] || "bg-gray-500"}`}
              style={{ height: "120px" }} // Фиксированная высота карточки
            >
              <div className="flex items-center gap-4">
                <img
                  src={product.imageUrl}
                  alt={product.name}
                  className="w-16 h-16 object-cover rounded-md"
                />
                <div>
                  <h3 className="font-bold text-[14px]">{product.name}</h3>
                  {product.price && <p className="mt-1">{product.price}₽</p>}
                </div>
              </div>

              {/* Кнопки управления количеством */}
              <div className="h-full flex flex-col items-center justify-center">
                <div className="flex flex-col items-center gap-2 h-full justify-center">
                  <button
                    onClick={() => increaseCount(Number(id))}
                    className="bg-white text-black w-6 h-6 rounded-full flex items-center justify-center"
                  >
                    +
                  </button>
                  <span className="mx-2">{item.count}</span>
                  <button
                    onClick={() => decreaseCount(Number(id))}
                    className="bg-white text-black w-6 h-6 rounded-full flex items-center justify-center"
                  >
                    -
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-auto mb-4">
        <input
          type="text"
          placeholder="Введите промокод"
          value={promoCode}
          onChange={(e) => setPromoCode(e.target.value)}
          className="p-2 border rounded w-full"
        />
      </div>

      <div className="mt-4 mb-8">
        <div className="flex justify-between">
          <span>Итоговое количество товаров:</span>
          <span>{totalItems}</span>
        </div>
        <div className="flex justify-between">
          <span>Итоговая сумма:</span>
          <span>{totalPrice} ₽</span>
        </div>
        <div className="flex justify-between">
          <span>Доставка:</span>
          <span>{deliveryPrice} ₽</span>
        </div>
      </div>

      <button className="mt-4 w-full bg-blue-500 text-white py-2 rounded">
        Оформить заказ
      </button>
    </div>
  );
};

export default CartPage;