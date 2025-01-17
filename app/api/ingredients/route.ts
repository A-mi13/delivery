import { prisma } from "@/prisma/prisma-client";
import { NextResponse } from "next/server";

export async function GET() {
  const ingredients = await prisma.ingredient.findMany()
  
  return NextResponse.json(ingredients)
}

export async function POST(req: Request) {
  const { cartItemId, ingredientId, quantity } = await req.json();

  try {
    const updatedIngredient = await prisma.cartItemIngredient.upsert({
      where: {
        cartItemId_ingredientId: {
          cartItemId,
          ingredientId,
        },
      },
      update: { quantity },
      create: {
        cartItemId,
        ingredientId,
        quantity,
      },
    });

    return NextResponse.json(updatedIngredient);
  } catch (error) {
    console.error("Failed to update ingredient:", error);
    return NextResponse.json({ error: "Failed to update ingredient quantity" }, { status: 500 });
  }
}