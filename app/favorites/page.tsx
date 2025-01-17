"use client";

import { useFavorites } from "@/components/shared/FavoritesContext";
import { useCart } from "@/components/shared/CartContext"; // Импортируем контекст корзины
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { useEffect, useState } from "react";

const categoryColors: { [key: number]: string } = {
  1: "bg-red-500",
  2: "bg-green-500",
  3: "bg-blue-500",
  4: "bg-yellow-500",
  5: "bg-purple-500",
};

const FavoritesPage = () => {
  const { favorites } = useFavorites();
  const { cart, addToCart, increaseCount, decreaseCount } = useCart(); // Используем контекст корзины
  const router = useRouter();
  const [allProducts, setAllProducts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch("/api/products");
        if (!response.ok) {
          throw new Error("Failed to fetch products");
        }
        const data = await response.json();
        setAllProducts(data);
      } catch (error) {
        console.error("Failed to fetch products:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const favoriteProducts = allProducts.filter((product) => favorites.includes(product.id));

  if (isLoading) {
    return (
      <div className="p-4">
        <button onClick={() => window.location.href = "/"} className="flex items-center text-gray-600 hover:text-black">
          <ArrowLeft className="w-6 h-6" />
        </button>
        <h1 className="text-2xl font-bold mb-4">Избранное</h1>
        <p>Загрузка...</p>
      </div>
    );
  }

  if (favoriteProducts.length === 0) {
    return (
      <div className="p-4">
        <button onClick={() => window.location.href = "/"} className="flex items-center text-gray-600 hover:text-black">
          <ArrowLeft className="w-6 h-6" />
        </button>
        <h1 className="text-2xl font-bold mb-4">Избранное</h1>
        <p>В избранном пока нет товаров.</p>
      </div>
    );
  }

  return (
    <div className="p-4">
      <button onClick={() => window.location.href = "/"} className="flex items-center text-gray-600 hover:text-black">
        <ArrowLeft className="w-6 h-6" />
      </button>
      <h1 className="text-2xl font-bold mb-4">Избранное</h1>
      <div className="space-y-4"> {/* Карточки теперь идут одна под другой */}
        {favoriteProducts.map((product) => {
          const count = cart[product.id]?.count || 0; // Получаем количество товара в корзине

          return (
            <div
              key={product.id}
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

              {/* Кнопка добавления в корзину */}
              <div className="h-full flex flex-col items-center justify-center">
                {count > 0 ? (
                  <div className="flex flex-col items-center gap-2 h-full justify-center">
                    <button
                      onClick={() => increaseCount(product.id)}
                      className="bg-white text-black w-6 h-6 rounded-full flex items-center justify-center"
                    >
                      +
                    </button>
                    <span className="mx-2">{count}</span>
                    <button
                      onClick={() => decreaseCount(product.id)}
                      className="bg-white text-black w-6 h-6 rounded-full flex items-center justify-center"
                    >
                      -
                    </button>
                  </div>
                ) : (
                  <button
                    className="bg-[#70B9BE] text-white h-full w-10 flex items-center justify-center rounded-r-lg"
                    style={{ borderRadius: "0.5rem 0.5rem 0.5rem 0.5rem" }} // Овальная форма
                    onClick={() => addToCart(product.id)}
                  >
                    +
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default FavoritesPage;