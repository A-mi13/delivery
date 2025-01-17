import { NextResponse } from "next/server";
import { prisma } from "@/prisma/prisma-client";

export async function POST(request: Request) {
  const { cartItemId, ingredientId, quantity } = await request.json();

  try {
    // Удалено использование cartItemIngredient
    // const updatedIngredient = await prisma.cartItemIngredient.upsert({
    //   where: {
    //     cartItemId_ingredientId: {
    //       cartItemId,
    //       ingredientId,
    //     },
    //   },
    //   update: {
    //     quantity,
    //   },
    //   create: {
    //     cartItemId,
    //     ingredientId,
    //     quantity,
    //   },
    // });

    return NextResponse.json({ success: true, message: "Ingredient logic removed" });
  } catch (error) {
    console.error("Failed to process request:", error);
    return NextResponse.json(
      { error: "Failed to process request" },
      { status: 500 }
    );
  }
}