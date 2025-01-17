"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Settings } from "lucide-react";

const PersonalAccount: React.FC = () => {
  const router = useRouter();

  const cards = [
    { id: 1, title: "Мои заказы", bgColor: "bg-[#F5F5F5]", route: "/profile/orders" },
    { id: 2, title: "Адрес доставки", bgColor: "bg-[#F5F5F5]", route: "/profile/address" },
    { id: 3, title: "Бонусы", bgColor: "bg-[#F5F5F5]", route: "/profile/bonuses" },
  ];

  const handleGoHome = () => {
    window.location.href = "/"; // Переход на главную страницу
  };

  return (
    <div className="max-w-[430px] mx-auto px-4 py-6 relative">
      {/* Верхняя панель с кнопками */}
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={handleGoHome}
          className="flex items-center text-gray-600 hover:text-black"
        >
          <ArrowLeft className="w-6 h-6" />
        </button>
        <button
          onClick={() => router.push("/profile/settings")}
          className="flex items-center text-gray-600 hover:text-black"
        >
          <Settings className="w-6 h-6" />
        </button>
      </div>

      <h1 className="text-2xl font-bold flex-grow text-black mb-6">
        ЛИЧНЫЙ КАБИНЕТ
      </h1>

      {/* Карточки */}
      <div className="grid grid-cols-3 gap-4 justify-center">
        {cards.map((card) => (
          <div
            key={card.id}
            onClick={() => router.push(card.route)}
            className={`w-[124px] h-[173px] rounded-lg shadow-md flex items-center justify-center cursor-pointer ${card.bgColor}`}
          >
            <p className="text-center text-black text-lg font-semibold px-2">
              {card.title}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PersonalAccount;
