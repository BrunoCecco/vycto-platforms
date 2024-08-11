"use client";
import { useState } from "react";
import Image from "next/image";
import PointsBadge from "../pointsBadge";

const PlayerSelection = () => {
  const [selectedPlayer, setSelectedPlayer] = useState<string | null>(null);

  const players = [
    {
      name: "Giannis Antetokounmpo",
      position: "Small Forward",
      image: "/player.png",
    },
    {
      name: "Damian Lillard",
      position: "Point Guard",
      image: "/player.png",
    },
    {
      name: "Brook Lopez",
      position: "Centre",
      image: "/player.png",
    },
    {
      name: "Khris Middleton",
      position: "Shooting Guard",
      image: "/player.png",
    },
  ];

  return (
    <div className="flex items-center justify-center">
      <div className="relative w-full rounded-lg bg-white p-4 shadow-xl md:w-1/2 md:p-10">
        {/* Points Badge */}
        <PointsBadge points={5} />

        {/* Question */}
        <h2 className="mb-2 text-center text-xl font-semibold text-gray-800">
          Who will score the 1st point?
        </h2>
        <p className="mb-6 text-center text-gray-500">
          Select the correct answer
        </p>

        {/* Player Options */}
        <div className="grid grid-cols-2 gap-4">
          {players.map((player) => (
            <div
              key={player.name}
              className={`cursor-pointer rounded-lg border-2 p-2 shadow-sm transition duration-200 ${
                selectedPlayer === player.name
                  ? "border-yellow-500"
                  : "border-transparent"
              }`}
              onClick={() => setSelectedPlayer(player.name)}
            >
              <Image
                src={player.image}
                alt={player.name}
                layout="responsive"
                width={128}
                height={96}
                objectFit="cover"
                className={`rounded-md ${
                  selectedPlayer !== player.name ? "opacity-50" : "opacity-100"
                }`}
              />
              <div className="mt-2 text-center">
                <p className="text-sm font-semibold text-gray-800">
                  {player.name}
                </p>
                <p className="text-xs text-gray-500">{player.position}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PlayerSelection;
