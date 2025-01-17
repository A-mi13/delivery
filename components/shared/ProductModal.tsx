import React, { useEffect, useState, useRef } from "react";
import { Product } from "@prisma/client";
import { HeartIcon } from "lucide-react"; // Импорт иконки сердечка
import { useFavorites } from "./FavoritesContext"; // Импортируем контекст избранных товаров
import Notification from "./Notification";

// Определяем тип CartItem, если он ещё не определён
interface CartItem {
  id: number;
  count: number; // Используем `count` вместо `quantity`, так как это используется в вашем коде
  price: number;
  // Добавьте другие свойства, если они есть
}

interface ProductModalProps {
  product: Product;
  onClose: () => void;
  cart: Record<number, CartItem>;
  handleAddToCart: (productId: number) => void;
  handleIncrease: (productId: number) => void;
  handleDecrease: (productId: number) => void;
}

const ProductModal: React.FC<ProductModalProps> = ({
  product,
  onClose,
  cart,
  handleAddToCart,
  handleIncrease,
  handleDecrease,
}) => {
  const [ingredientCart, setIngredientCart] = useState<{ [key: number]: number }>({});
  const [allIngredients, setAllIngredients] = useState<any[]>([]);
  const [isFullScreen, setIsFullScreen] = useState(false); // Управление состоянием модалки
  const startY = useRef<number | null>(null);
  const { favorites, addToFavorites, removeFromFavorites } = useFavorites(); // Используем контекст избранных товаров
  const [notification, setNotification] = useState<{
    message: string;
    backgroundColor: string;
  } | null>(null); // Состояние для текущего уведомления

  const isFavorite = favorites.includes(product.id); // Проверяем, находится ли товар в избранном

  const toggleFavorite = () => {
    if (isFavorite) {
      removeFromFavorites(product.id);
      setNotification({
        message: "УДАЛЕНО ИЗ ИЗБРАННОГО",
        backgroundColor: "bg-red-500",
      }); // Уведомление об удалении
    } else {
      addToFavorites(product.id);
      setNotification({
        message: "ДОБАВЛЕНО В ИЗБРАННОЕ",
        backgroundColor: "bg-green-500",
      }); // Уведомление о добавлении
    }
  };

  // Загрузка ингредиентов с сервера
  useEffect(() => {
    const fetchIngredients = async () => {
      try {
        const response = await fetch("/api/ingredients");
        const data = await response.json();
        setAllIngredients(data);
      } catch (error) {
        console.error("Failed to fetch ingredients:", error);
      }
    };

    fetchIngredients();
  }, []);

  const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    startY.current = e.touches[0].clientY;
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    if (startY.current === null) return;

    const deltaY = e.touches[0].clientY - startY.current;

    // Если тянем вверх, открываем модалку полностью
    if (deltaY < -50) {
      setIsFullScreen(true);
    }

    // Если тянем вниз, возвращаем в исходное положение
    if (deltaY > 50) {
      setIsFullScreen(false);
    }
  };

  const handleTouchEnd = () => {
    startY.current = null;
  };

  // Сохранение изменений при закрытии модального окна
  const handleClose = async () => {
    for (const [ingredientId, quantity] of Object.entries(ingredientCart)) {
      await updateIngredientCart(parseInt(ingredientId), quantity);
    }
    onClose();
  };

  const updateIngredientCart = async (id: number, delta: number) => {
    const updatedQuantity = Math.max((ingredientCart[id] || 0) + delta, 0);
    setIngredientCart((prev) => ({
      ...prev,
      [id]: updatedQuantity,
    }));

    try {
      await fetch("/api/ingredients", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          cartItemId: product.id,
          ingredientId: id,
          quantity: updatedQuantity,
        }),
      });
    } catch (error) {
      console.error("Failed to update ingredient:", error);
    }
  };

  const renderCartControls = (
    cart: Record<number, CartItem>,
    id: number,
    handleIncrease: (id: number) => void,
    handleDecrease: (id: number) => void
  ) => {
    const count = cart[id]?.count || 0;
    return count > 0 ? (
      <div
        className={`flex items-center text-white p-1 rounded-full w-full justify-center transition-colors duration-500 ease-in-out ${
          count > 0 ? "bg-[#70B9BE]" : "bg-[#F5F5F5]"
        }`}
      >
        <button className="text-white px-2" onClick={() => handleDecrease(id)}>
          -
        </button>
        <span className="mx-2">{count}</span>
        <button className="text-white px-2" onClick={() => handleIncrease(id)}>
          +
        </button>
      </div>
    ) : (
      <button
        className="bg-[#70B9BE] text-[#F5F5F5] p-1 rounded-full w-full transition-colors duration-500 ease-in-out"
        onClick={() => handleIncrease(id)}
      >
        +
      </button>
    );
  };

  return (
    <div className="fixed inset-0 flex items-end justify-center bg-black bg-opacity-50 z-50">
      <div
        className={`bg-white max-w-[430px] w-full ${
          isFullScreen ? "h-[100%]" : "h-[70%]"
        } rounded-t-lg p-4 relative overflow-y-auto transition-all duration-300`}
      >
        <div
          className="w-[134px] h-[5px] bg-gray-300 rounded-full mx-auto mb-4 cursor-pointer"
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        />
        <button className="absolute top-2 right-2 text-gray-600" onClick={handleClose}>
          ×
        </button>
        <div className="relative">
          <img
            src={product.imageUrl}
            alt={product.name}
            className="w-full h-48 object-cover rounded-md"
          />
          {/* Иконка сердечка */}
          <button className="absolute bottom-2 right-2" onClick={toggleFavorite}>
            <HeartIcon
              size={24}
              className={isFavorite ? "text-[#70B9BE]" : "text-gray-300"}
            />
          </button>
        </div>

        {/* Уведомление */}
        {notification && (
          <Notification
            message={notification.message}
            onClose={() => setNotification(null)} // Закрытие уведомления
            backgroundColor={notification.backgroundColor}
          />
        )}

        <h3 className="text-xl w-full font-bold mt-2">{product.name}</h3>
        {product.price && <p className="text-lg mt-1">{product.price}₽</p>}
        <p className="mt-2">Описание товара...</p>

        <div className="flex items-center w-full justify-center mt-auto">
          {renderCartControls(cart, product.id, handleIncrease, handleDecrease)}
        </div>

        <div className="grid grid-cols-3 gap-2 mt-4">
          {allIngredients.slice(0, 3).map((ingredient) => (
            <div key={ingredient.id} className="flex flex-col items-center">
              <img
                src={ingredient.imageUrl}
                alt={ingredient.name}
                className="w-16 h-16 object-cover rounded-full"
              />
              <p className="text-sm mt-1 font-semibold">{ingredient.name}</p>
              <p className="text-sm text-gray-600">{ingredient.price}₽</p>
              <div className="flex items-center justify-center w-full mt-auto">
                {renderCartControls(
                  ingredientCart,
                  ingredient.id,
                  (id) => updateIngredientCart(id, 1),
                  (id) => updateIngredientCart(id, -1)
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProductModal;