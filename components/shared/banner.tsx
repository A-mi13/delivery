"use client";

import { cn } from "@/lib/utils";
import React, { useState, useEffect, useRef } from "react";
import { Container } from "./container";
import { useRouter } from "next/navigation";
import { X } from "lucide-react"; // Импортируем иконку крестика

interface Props {
  className?: string;
}

export const Banner: React.FC<Props> = ({ className }) => {
  const router = useRouter();

  const images = [
    {
      src: "/banner1.png",
      alt: "Image 1",
      content: <p>Контент для изображения 1</p>,
      link: "/page1", // Ссылка для перехода
    },
    {
      src: "/banner2.png",
      alt: "Image 2",
      content: <p>Контент для изображения 2</p>,
    },
    {
      src: "/banner3.png",
      alt: "Image 2",
      content: <p>Контент для изображения 2</p>,
    },
  ];

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeContent, setActiveContent] = useState<React.ReactNode | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0); // Текущий индекс баннера
  const [isPaused, setIsPaused] = useState(false); // Флаг паузы
  const sliderRef = useRef<HTMLDivElement>(null); // Ссылка на слайдер для обработки свайпов
  const autoSlideTimeout = useRef<NodeJS.Timeout | null>(null); // Таймер автоперелистывания
  const [isVisible, setIsVisible] = useState(true); // Видимость баннера

  // Автоматическое перелистывание каждые 5 секунд
  useEffect(() => {
    if (!isPaused) {
      autoSlideTimeout.current = setInterval(() => {
        setCurrentIndex((prevIndex) =>
          prevIndex === images.length - 1 ? 0 : prevIndex + 1
        );
      }, 5000);
    }

    return () => {
      if (autoSlideTimeout.current) clearInterval(autoSlideTimeout.current);
    };
  }, [images.length, isPaused]);

  // Остановка автоперелистывания на 5 секунд после свайпа
  const pauseAutoSlide = () => {
    setIsPaused(true);
    if (autoSlideTimeout.current) clearInterval(autoSlideTimeout.current);
    setTimeout(() => {
      setIsPaused(false);
    }, 5000); // Пауза на 5 секунд
  };

  // Логика для ручного перелистывания через свайпы
  const handleSwipe = (direction: "left" | "right") => {
    pauseAutoSlide(); // При свайпе ставим на паузу автоматическое листание

    if (direction === "left") {
      setCurrentIndex((prevIndex) =>
        prevIndex === images.length - 1 ? 0 : prevIndex + 1
      );
    } else if (direction === "right") {
      setCurrentIndex((prevIndex) =>
        prevIndex === 0 ? images.length - 1 : prevIndex - 1
      );
    }
  };

  // Обработчик событий мыши или касания для свайпа
  useEffect(() => {
    const slider = sliderRef.current;
    if (!slider) return;

    let startX = 0;
    let endX = 0;

    const onTouchStart = (e: TouchEvent) => {
      startX = e.touches[0].clientX;
    };

    const onTouchEnd = (e: TouchEvent) => {
      endX = e.changedTouches[0].clientX;
      if (startX > endX + 50) handleSwipe("left"); // Свайп влево
      if (startX < endX - 50) handleSwipe("right"); // Свайп вправо
    };

    const onMouseDown = (e: MouseEvent) => {
      startX = e.clientX;
    };

    const onMouseUp = (e: MouseEvent) => {
      endX = e.clientX;
      if (startX > endX + 50) handleSwipe("left"); // Свайп влево
      if (startX < endX - 50) handleSwipe("right"); // Свайп вправо
    };

    slider.addEventListener("touchstart", onTouchStart);
    slider.addEventListener("touchend", onTouchEnd);
    slider.addEventListener("mousedown", onMouseDown);
    slider.addEventListener("mouseup", onMouseUp);

    return () => {
      slider.removeEventListener("touchstart", onTouchStart);
      slider.removeEventListener("touchend", onTouchEnd);
      slider.removeEventListener("mousedown", onMouseDown);
      slider.removeEventListener("mouseup", onMouseUp);
    };
  }, []);

  // Обработчик клика на изображение
  const handleImageClick = (image: typeof images[0]) => {
    if (image.link) {
      router.push(image.link); // Переход по ссылке
    } else {
      setActiveContent(image.content);
      setIsModalOpen(true); // Открытие модального окна для других изображений
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setActiveContent(null);
  };

  const closeBanner = () => {
    setIsVisible(false); // Убираем баннер при нажатии на крестик
  };

  if (!isVisible) return null;

  return (
    <div className={cn("", className)}>
      <Container className="flex items-center justify-center px-[19px] relative overflow-hidden">
        <div
          ref={sliderRef}
          className="w-[390px] h-[90px] overflow-hidden relative cursor-grab"
        >
          <div
            className="flex transition-transform duration-1000 ease-in-out"
            style={{
              transform: `translateX(-${currentIndex * 390}px)`, // Сдвиг по ширине одного изображения
            }}
          >
            {images.map((image, index) => (
              <img
                key={index}
                className="w-[390px] h-[90px] flex-shrink-0"
                src={image.src}
                alt={image.alt}
                onClick={() => handleImageClick(image)}
              />
            ))}
          </div>
        </div>
        {/* Иконка крестика для закрытия баннера */}
        <X
          className="absolute top-[9px] right-[30px] w-4 h-4 text-black cursor-pointer"
          onClick={closeBanner}
        />
      </Container>

      {/* Модальное окно */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-4 rounded-md relative">
            <button
              className="absolute top-2 right-2 text-xl font-bold"
              onClick={closeModal}
            >
              &times;
            </button>
            {/* Отображение контента для текущего изображения */}
            <div className="modal-content">{activeContent}</div>
          </div>
        </div>
      )}
    </div>
  );
};
