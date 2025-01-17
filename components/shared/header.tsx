"use client";

import { cn } from "@/lib/utils";
import React, { useState } from "react";
import { Container } from "./container";
import { Slider as RadixSlider } from "@radix-ui/react-slider";
import { useRouter } from "next/navigation"; // Импортируйте useRouter из next/navigation

interface Props {
  className?: string;
}

export const Header: React.FC<Props> = ({ className }) => {
  const router = useRouter();

  const images = [
    {
      src: "/1.png",
      alt: "Image 1",
      content: <p>Контент для изображения 1</p>,
      link: "/page1", // Ссылка для перехода
    },
    {
      src: "/2.png",
      alt: "Image 2",
      content: <p>Контент для изображения 2</p>
    },
    {
      src: "/3.png",
      alt: "Image 3",
      content: <p>Контент для изображения 3</p>
    },
    {
      src: "/4.png",
      alt: "Image 4",
      content: <p>Контент для изображения 4</p>
    },
  ];

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeContent, setActiveContent] = useState<React.ReactNode | null>(null);

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

  return (
    <header className={cn('', className)}>
      <Container className="flex items-center justify-center py-[17px] px-[19px]">
        <RadixSlider orientation="horizontal" className="h-[130px] flex">
          {images.map((image, index) => (
            <img
              key={index}
              className={`w-90 h-130 ${index < images.length - 1 ? 'mr-2' : ''} cursor-pointer`}
              src={image.src}
              alt={image.alt}
              onClick={() => handleImageClick(image)}
            />
          ))}
        </RadixSlider>
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
            <div className="modal-content">
              {activeContent}
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
