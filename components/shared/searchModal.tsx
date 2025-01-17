// SearchModal.tsx
import React, { useState } from "react";
import Link from "next/link";
import { XIcon } from "lucide-react";

interface Product {
  id: number;
  name: string;
  imageUrl: string;
}

interface SearchModalProps {
  onClose: () => void;
}

const fetchSearchResults = async (query: string) => {
  const response = await fetch(`/api/products/search?query=${query}`);
  if (!response.ok) throw new Error("Error fetching search results");
  return response.json();
};

const SearchModal: React.FC<SearchModalProps> = ({ onClose }) => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Product[]>([]);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setQuery(value);
    if (value) fetchSearchResults(value).then(setResults).catch(console.error);
    else setResults([]);
  };

  return (
    <div className="fixed max-w-[480px] inset-0 bg-white z-40 flex flex-col items-center pt-6 px-4 mr-auto ml-auto px-3">
      <button onClick={onClose} className="absolute top-4 right-4 text-[#70B9BE]">
        <XIcon size={28} />
      </button>
      <input
        type="text"
        placeholder="Поиск товаров..."
        className="w-full max-w-[480px] mt-12 p-4 border-2 border-[#70B9BE] rounded-lg text-center"
        autoFocus
        value={query}
        onChange={handleInputChange}
      />
      <div className="mt-4 w-full max-w-lg">
        {results.map((product) => (
          <Link key={product.id} href={`/product/${product.id}`} className="flex items-center gap-3 w-full px-3 py-2">
            <img className="h-8 w-8 rounded-sm" src={product.imageUrl} alt={product.name} />
            <span>{product.name}</span>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default SearchModal;
