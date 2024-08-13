"use client";

import Image from "next/image";
import { FC, useState } from "react";
import PointsBadge from "../pointsBadge";
import { PlusCircle, MinusCircle } from "lucide-react";

const GuessScore = () => {
  const [scoreHome, setScoreHome] = useState(0);
  const [scoreAway, setScoreAway] = useState(0);

  return (
    <div className="flex items-center justify-center">
      <div className="relative w-full rounded-lg bg-white p-4 shadow-xl md:w-1/2 md:p-10">
        {/* Points Badge */}
        <PointsBadge points={5} />

        <h2 className="mb-12 text-xl font-semibold text-gray-800">
          Guess the score 🔥
        </h2>

        {/* Teams */}
        <div className="flex w-full items-center justify-between gap-4 py-4 md:justify-around md:px-4">
          <div className="flex flex-col items-center gap-4 text-gray-500">
            <div className="flex items-center gap-4 md:gap-8">
              <button onClick={() => setScoreHome(Math.max(scoreHome - 1, 0))}>
                <MinusCircle />
              </button>
              <div>{scoreHome}</div>
              <button onClick={() => setScoreHome(Math.max(scoreHome + 1, 0))}>
                <PlusCircle />
              </button>
            </div>
            <p className="text-sm font-semibold">Real Madrid</p>
          </div>

          {/* VS */}
          <div className="text-center">
            <div className="rounded-full border-2 border-blue-600 p-2 text-sm font-bold italic text-blue-600 md:text-xl">
              VS
            </div>
          </div>

          <div className="flex flex-col items-center gap-4 text-gray-500">
            <div className="flex items-center gap-4 md:gap-8">
              <button onClick={() => setScoreAway(Math.max(scoreAway - 1, 0))}>
                <MinusCircle />
              </button>
              <div>{scoreAway}</div>
              <button onClick={() => setScoreAway(Math.max(scoreAway + 1, 0))}>
                <PlusCircle />
              </button>
            </div>
            <p className="text-sm font-semibold ">Chelsea</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GuessScore;
