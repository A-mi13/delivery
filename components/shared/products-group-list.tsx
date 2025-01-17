import React from "react";
import { Title } from "./title";
import { ProductCard } from "./ProductСard"; 
import { cn } from "@/lib/utils";

interface Props {
  title: string;
  items: any[];
  className?: string;
  categoryId: number;
  listClassName?: string;
}

export const ProductsGroupList: React.FC<Props> = ({ title, items, className, categoryId, listClassName }) => {
  const filteredItems = items.filter((item) => item.categoryId === categoryId);

  return (
    <div className={cn("p-4", className)}>
      <Title text={title} size="lg" className="font-extrabold mb-5" />
      <div className={cn("grid grid-cols-2 gap-[10px]", listClassName)}>
        {filteredItems.map((item) => (
          <ProductCard
            key={item.id}
            id={item.id}
            name={item.name}
            imageUrl={item.imageUrl}
            price={item.price}
          />
        ))}
      </div>
    </div>
  );
};
