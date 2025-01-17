import { NextResponse } from "next/server";
import { prisma } from "@/prisma/prisma-client";

export async function POST(request: Request) {
  try {
    const { productId, quantity, userId } = await request.json();

    console.log("Received data:", { productId, quantity, userId });

    // Проверяем, существует ли корзина для пользователя
    const existingCart = await prisma.cart.findUnique({
      where: { userId },
    });

    console.log("Cart found:", existingCart);

    // Если корзины нет, создаем новую
    const cart = existingCart
      ? existingCart
      : await prisma.cart.create({
          data: {
            userId,
            token: "", // Убедитесь, что поле token передается, если оно обязательно
          },
        });

    console.log("Cart to use:", cart);

    // Проверяем, существует ли продукт с указанным productId
    const product = await prisma.product.findUnique({
      where: { id: productId },
    });

    if (!product) {
      return NextResponse.json(
        { error: "Product not found" },
        { status: 404 }
      );
    }

    // Создаем ProductItem на основе Product, если он еще не существует
    const existingProductItem = await prisma.productItem.findFirst({
      where: {
        productId: product.id,
      },
    });

    const productItem = existingProductItem
      ? existingProductItem
      : await prisma.productItem.create({
          data: {
            productId: product.id,
            price: product.price, // Копируем цену из Product
            type: 0, // Значение по умолчанию для поля type
          },
        });

    console.log("Product item to use:", productItem);

    // Проверяем, есть ли уже такой товар в корзине
    const existingCartItem = await prisma.cartItem.findFirst({
      where: {
        cartId: cart.id,
        productItemId: productItem.id,
      },
    });

    console.log("Existing cart item:", existingCartItem);

    if (existingCartItem) {
      // Если товар уже есть в корзине, увеличиваем его количество
      await prisma.cartItem.update({
        where: { id: existingCartItem.id },
        data: { quantity: existingCartItem.quantity + quantity },
      });
    } else {
      // Если товара нет в корзине, добавляем его
      await prisma.cartItem.create({
        data: {
          cartId: cart.id,
          productItemId: productItem.id,
          quantity,
        },
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Failed to add to cart:", error);
    return NextResponse.json(
      { error: "Failed to add to cart" },
      { status: 500 }
    );
  }
}