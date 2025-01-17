"use client";

import React, { useState } from "react";

const OrdersPage: React.FC = () => {
  const [orders, setOrders] = useState([
    {
      id: 1240,
      date: "22 мая 2024 г. в 13:32",
      deliveryType: "Доставка",
      address: "Ставрополь, ул. 50 лет ВЛКСМ, 113",
      item: "Шаурма с сыром, Самая мощная шаурма в мире без аналогов",
      total: "1 500 ₽",
    },
    {
      id: 1241,
      date: "22 мая 2024 г. в 13:32",
      deliveryType: "Самовывоз",
      address: "Ставрополь, ул. Ленина, 246",
      item: "Шаурма с сыром, Самая мощная шаурма в мире без аналогов",
      total: "2 700 ₽",
    },
  ]);

  return (
    <div className="max-w-[430px] mx-auto px-4 py-6">
      <div className="flex items-center mb-6">
          <button
            className="text-[#FF0000] mr-4"
            onClick={() => window.location.href = "/profile"}
          >
            ← Личный кабинет
          </button>
        </div>
      <h1 className="text-xl font-bold mb-6">История заказов</h1>
      {orders.length === 0 ? (
        <p className="text-center text-gray-500">Пусто</p>
      ) : (
        orders.map((order) => (
          <div
            key={order.id}
            className="bg-white p-4 rounded-lg shadow-md mb-4 text-black"
          >
            <p className="text-sm font-semibold mb-2">№ {order.id}</p>
            <p className="text-sm text-gray-600 mb-1">{order.date}</p>
            <p className="text-sm text-gray-600 mb-1">
              {order.deliveryType}: {order.address}
            </p>
            <p className="text-sm text-black mb-2">{order.item}</p>
            <p className="text-sm font-bold mb-2">Сумма: {order.total}</p>
            <button className="text-red-500 font-semibold">
              Повторить заказ
            </button>
          </div>
        ))
      )}
    </div>
  );
};

export default OrdersPage;
