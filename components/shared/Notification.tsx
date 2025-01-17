// components/shared/Notification.tsx
"use client";

import React, { useEffect } from "react";

interface NotificationProps {
  message: string;
  onClose: () => void;
  backgroundColor?: string;
}

const Notification: React.FC<NotificationProps> = ({
  message,
  onClose,
  backgroundColor = "bg-green-500",
}) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose(); // Автоматическое закрытие через 2 секунды
    }, 2000);

    return () => clearTimeout(timer); // Очистка таймера при размонтировании
  }, [onClose]);

  return (
    <div
      className={`fixed bottom-4 right-4 ${backgroundColor} text-white p-4 rounded-lg shadow-lg flex items-center justify-between`}
    >
      <span>{message}</span>
      <button onClick={onClose} className="ml-4">
        ×
      </button>
    </div>
  );
};

export default Notification;