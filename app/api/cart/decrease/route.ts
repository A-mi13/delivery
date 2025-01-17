import { NextResponse } from "next/server";
import { prisma } from "@/prisma/prisma-client";

export async function DELETE(request: Request) {
  try {
    const { productId, userId } = await request.json();

    console.log("Received data:", { productId, userId });

    // Проверяем, существует ли корзина для пользователя
    let cart = await prisma.cart.findUnique({
      where: { userId },
    });

    console.log("Cart found:", cart);

    // Если корзины нет, возвращаем ошибку, так как нечего удалять
    if (!cart) {
      return NextResponse.json(
        { error: "Cart not found" },
        { status: 404 }
      );
    }

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

    // Проверяем, существует ли productItem для данного productId
    const productItem = await prisma.productItem.findFirst({
      where: {
        productId: product.id,
      },
    });

    if (!productItem) {
      return NextResponse.json(
        { error: "Product item not found" },
        { status: 404 }
      );
    }

    // Проверяем, есть ли уже такой товар в корзине
    const existingCartItem = await prisma.cartItem.findFirst({
      where: {
        cartId: cart.id,
        productItemId: productItem.id, // Ищем по productItemId
      },
    });

    console.log("Existing cart item:", existingCartItem);

    if (!existingCartItem) {
      return NextResponse.json(
        { error: "Item not found in cart" },
        { status: 404 }
      );
    }

    // Уменьшаем количество товара или удаляем его, если количество = 1
    if (existingCartItem.quantity > 1) {
      await prisma.cartItem.update({
        where: { id: existingCartItem.id },
        data: { quantity: existingCartItem.quantity - 1 },
      });
    } else {
      await prisma.cartItem.delete({
        where: { id: existingCartItem.id },
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Failed to decrease count:", error);
    return NextResponse.json(
      { error: "Failed to decrease count" },
      { status: 500 }
    );
  }
}