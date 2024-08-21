"use client";
import React, { useState } from "react";
import axios from "axios";
import Image from "next/image";

interface SearchResult {
  name: string;
  type: string;
  slug: string;
  id: number;
}

interface Props {
  onSelect: (result: SearchResult) => void;
}

const Search: React.FC<Props> = ({ onSelect }) => {
  const [results, setResults] = useState<SearchResult[]>([]);

  const handleSearch = async (data: FormData) => {
    const query = data.get("query") as string;
    if (query.length > 2) {
      const response = await axios.get(
        `https://www.sofascore.com/api/v1/search/all?q=${query}&page=0`,
      );
      const players = response.data.results.map((result: any) => ({
        name: result.entity.name,
        type: result.type,
        slug: result.entity.slug,
        id: result.entity.id,
      }));
      setResults(players);
    } else {
      setResults([]);
    }
  };

  const handleSelect = (result: SearchResult) => {
    // setQuery("");
    setResults([]);
    onSelect(result);
  };

  return (
    <div>
      <form
        action={(data: FormData) => handleSearch(data)}
        className="relative"
      >
        <input
          type="text"
          name="query"
          placeholder="Search for a player or team..."
          className="z-10 w-full flex-1 rounded-md border border-stone-300 text-sm text-stone-900 placeholder-stone-300 focus:border-stone-500 focus:outline-none focus:ring-stone-500 dark:border-stone-600 dark:bg-black dark:text-white dark:placeholder-stone-700"
        />
      </form>
      {results.length > 0 && (
        <ul>
          {results.map((result) => (
            <li
              key={result.id}
              onClick={() => handleSelect(result)}
              className="flex cursor-pointer items-center rounded-md p-2 transition-all hover:bg-stone-100 dark:hover:bg-stone-800"
            >
              <div className="relative mr-2 h-8 w-8 overflow-hidden rounded-full">
                <Image
                  src={`https://www.sofascore.com/api/v1/${result.type}/${result.id}/image`}
                  alt={result.name}
                  fill={true}
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
              </div>
              <span>
                {result.name} ({result.type})
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Search;
