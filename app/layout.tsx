// app/layout.tsx
"use client";

import './globals.css';
import { Header } from '../components/shared/header';
import { Banner } from '../components/shared/banner';
import { Popular } from '../components/shared/popular';
import { Footer } from '../components/shared/footer';
import { Categories } from '../components/shared/categories';
import { CartProvider } from '@/components/shared/CartContext';
import { usePathname } from 'next/navigation';
import { FavoritesProvider } from '@/components/shared/FavoritesContext'; // Импортируем FavoritesProvider
import { Inter } from 'next/font/google';
const inter = Inter({
  subsets: ['cyrillic'],
  variable: '--font-nunito',
  weight: ['400', '500', '600', '700', '800', '900'],
});

// Данные для товаров
const productsData = {
  1: [
    {
      id: 1,
      name: 'Pizza',
      imageUrl: 'https://stavropol.crazybrothers.ru/wp-content/uploads/Shaurma-Stavropol-700x467.jpg',
      price: 550,
      items: [{ price: 550 }],
    },
    {
      id: 2,
      name: 'Burger',
      imageUrl: 'https://stavropol.crazybrothers.ru/wp-content/uploads/Burger-Stavropol.jpg',
      price: 350,
      items: [{ price: 350 }],
    },
    {
      id: 5,
      name: 'Pizza',
      imageUrl: 'https://stavropol.crazybrothers.ru/wp-content/uploads/Shaurma-Stavropol-700x467.jpg',
      price: 550,
      items: [{ price: 550 }],
    },
    {
      id: 6,
      name: 'Pizza',
      imageUrl: 'https://stavropol.crazybrothers.ru/wp-content/uploads/Shaurma-Stavropol-700x467.jpg',
      price: 550,
      items: [{ price: 550 }],
    },
  ],
  2: [
    {
      id: 3,
      name: 'Coke',
      imageUrl: '/cola.png',
      price: 150,
      items: [{ price: 150 }],
    },
    {
      id: 4,
      name: 'Juice',
      imageUrl: '/juice.png',
      price: 200,
      items: [{ price: 200 }],
    },
  ],
  4: [
    {
      id: 7,
      name: 'Coke',
      imageUrl: '/cola.png',
      price: 150,
      items: [{ price: 150 }],
    },
    {
      id: 8,
      name: 'Juice',
      imageUrl: '/juice.png',
      price: 200,
      items: [{ price: 200 }],
    },
  ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isHomePage = pathname === '/';

  return (
    <html lang="en">
      <body>
        <CartProvider>
          <FavoritesProvider> {/* Обернули всё в FavoritesProvider */}
            {isHomePage && (
              <>
                <Header />
                <Banner />
                <Popular />
              </>
            )}
            <main>{children}</main>
            {isHomePage && <Footer />}
            {isHomePage && <Categories productsData={productsData} />}
          </FavoritesProvider>
        </CartProvider>
      </body>
    </html>
  );
}