"use client";

import { useState } from "react";
import Input from "@/components/input";
import Button from "@/components/buttons/button";
import { Loader2 } from "lucide-react";
import axios from "axios";
import { SelectQuestion } from "@/lib/schema";
import { createQuestion } from "@/lib/actions";
import { QuestionType } from "@/lib/types";
import { createQuestions } from "./questionService";
import EditPlayerSelection from "../edit-questions/editPlayerSelection";
import EditWhatMinute from "../edit-questions/editWhatMinute";
import EditMatchOutcome from "../edit-questions/editMatchOutcome";
import EditGuessScore from "../edit-questions/editGuessScore";
import EditGeneralSelection from "../edit-questions/editGeneralSelection";
import EditTrueFalse from "../edit-questions/editTrueFalse";
import EditGeneralNumber from "../edit-questions/editGeneralNumber";
import { useRouter } from "next/navigation";

interface SearchResult {
  name: string;
  type: string;
  slug: string;
  id: number;
}

export default function SearchPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedResult, setSelectedResult] = useState<SearchResult | null>(
    null,
  );

  const router = useRouter();

  const generateQuestions = async (result: SearchResult) => {
    const response = await axios.get(
      `https://api.sofascore.com/api/v1/${result.type}/${result.id}`,
    );
    const data = response.data[result.type];

    // get current site url for competitionId
    const url = window.location.href;
    const competitionId = url.split("/").pop();

    if (competitionId === undefined) {
      console.error("Competition ID not found");
      return;
    }

    const entityQuestions = await createQuestions({
      entityId: data.id,
      competitionId: competitionId,
      type: result.type,
    });

    await Promise.all(
      entityQuestions.map(async (q: SelectQuestion) => {
        await createQuestion({
          competitionId: q.competitionId,
          type: q.type as QuestionType,
          question: q,
        });
      }),
    );
    router.push(`/competition/${competitionId}/editor`);
  };

  const handleSearch = async (data: FormData) => {
    setIsLoading(true);
    setSearchResults([]);
    const query = data.get("query") as string;
    if (query.length > 2) {
      const response = await axios.get(
        `https://api.sofascore.com/api/v1/search/all?q=${query}&page=0`,
      );
      const players = response.data.results
        .filter((result: any) => {
          return (
            (result.type == "team" || result.type == "player") &&
            !result?.entity.deceased &&
            (result.entity?.team?.sport?.name == "Football" ||
              result.entity?.sport?.name == "Football")
          );
        })
        .map((result: any) => ({
          name: result.entity.name,
          type: result.type,
          slug: result.entity.slug,
          id: result.entity.id,
        }));
      setSearchResults(players);
    } else {
      setSearchResults([]);
    }
    setIsLoading(false);
  };

  const handleResultClick = async (result: SearchResult) => {
    setSearchQuery("");
    setSelectedResult(result);
    setIsLoading(true);
    await generateQuestions(result);
    setTimeout(() => {
      setIsLoading(false);
    }, 2000);
  };

  return (
    <div className="flex min-h-screen ">
      <div className="w-full space-y-4">
        <h1 className="text-2xl font-bold dark:text-stone-200">
          Competition Creator
        </h1>
        <form
          action={(data: FormData) => handleSearch(data)}
          className="flex space-x-2"
        >
          <Input
            type="text"
            name="query"
            placeholder="Search for an athlete or team you sponsor..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-grow"
          />
          <Button type="submit" disabled={isLoading}>
            {isLoading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              "Search"
            )}
          </Button>
        </form>
        {searchResults.length > 0 && !selectedResult && (
          <ul className="divide-y divide-gray-200 rounded-md bg-white shadow-md">
            {searchResults.map((result) => (
              <li
                key={result.id}
                className="flex items-center p-2 py-1  transition duration-150 ease-in-out hover:bg-gray-50 focus:bg-gray-50 focus:outline-none"
              >
                <div className="relative mr-2 h-8 w-8 overflow-hidden rounded-full">
                  <img
                    src={`https://api.sofascore.com/api/v1/${result.type}/${result.id}/image`}
                    className="h-full w-full object-cover"
                    alt={result.name}
                    //   fill={true}
                    //   sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                </div>
                <button
                  onClick={() => handleResultClick(result)}
                  className="w-full px-4 py-2 text-left"
                >
                  {result.name}
                </button>
              </li>
            ))}
          </ul>
        )}
        {/* {selectedResult && (
          <div>
            <h2 className="mb-2 text-xl font-semibold">
              Drafting a competition for {selectedResult.name} (
              {selectedResult.type})
            </h2>
            {isLoading && (
              <div className="flex h-24 items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
              </div>
            )}
          </div>
        )} */}
      </div>
    </div>
  );
}
