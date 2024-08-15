"use client";
import { useState, FC } from "react";
import Image from "next/image";
import PointsBadge from "../pointsBadge";

interface Player {
  name: string;
  position: string;
  image: string;
}

const EditPlayerSelection: FC = () => {
  const [selectedPlayer, setSelectedPlayer] = useState<string | null>(null);
  const [isEditingQuestion, setIsEditingQuestion] = useState(false);
  const [isEditingPoints, setIsEditingPoints] = useState(false);
  const [editedQuestion, setEditedQuestion] = useState(
    "Who is the best player?",
  );
  const [points, setPoints] = useState(0);
  const [players, setPlayers] = useState<Player[]>([
    { name: "Player 1", position: "Forward", image: "/player.png" },
    { name: "Player 2", position: "Midfielder", image: "/player.png" },
    { name: "Player 3", position: "Defender", image: "/player.png" },
    { name: "Player 4", position: "Goalkeeper", image: "/player.png" },
  ]);

  const handleQuestionClick = () => {
    setIsEditingQuestion(true);
  };

  const handlePointsClick = () => {
    setIsEditingPoints(true);
  };

  const handleQuestionInputChange = (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setEditedQuestion(e.target.value);
  };

  const handlePointsInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPoints(Number(e.target.value));
  };

  const handlePlayerNameChange = (index: number, newName: string) => {
    const updatedPlayers = [...players];
    updatedPlayers[index].name = newName;
    setPlayers(updatedPlayers);
  };

  const handlePlayerPositionChange = (index: number, newPosition: string) => {
    const updatedPlayers = [...players];
    updatedPlayers[index].position = newPosition;
    setPlayers(updatedPlayers);
  };

  const handleInputBlur = () => {
    setIsEditingQuestion(false);
    setIsEditingPoints(false);
  };

  const handleSave = () => {
    alert(`Question saved: ${editedQuestion}, Points: ${points}`);
  };

  return (
    <div className="flex items-center justify-center">
      <div className="relative w-full rounded-lg bg-white p-4 shadow-xl md:w-1/2 md:p-10">
        {/* Editable Points Badge */}
        <div className="mb-4 flex justify-center">
          {isEditingPoints ? (
            <input
              type="number"
              value={points}
              onChange={handlePointsInputChange}
              onBlur={handleInputBlur}
              autoFocus
              className="w-20 text-center text-xl font-semibold text-gray-800"
            />
          ) : (
            <div className="cursor-pointer" onClick={handlePointsClick}>
              <PointsBadge points={points} />
            </div>
          )}
        </div>

        {/* Editable Question */}
        <div className="mb-2 text-center">
          {isEditingQuestion ? (
            <input
              type="text"
              value={editedQuestion}
              onChange={handleQuestionInputChange}
              onBlur={handleInputBlur}
              autoFocus
              className="w-full text-center text-xl font-semibold text-gray-800"
            />
          ) : (
            <h2
              className="cursor-pointer text-xl font-semibold text-gray-800"
              onClick={handleQuestionClick}
            >
              {editedQuestion}
            </h2>
          )}
        </div>
        <p className="mb-6 text-center text-gray-500">
          Select the correct answer
        </p>

        {/* Editable Player Options */}
        <div className="grid grid-cols-2 gap-4">
          {players.map((player, index) => (
            <div
              key={index}
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
                <input
                  type="text"
                  value={player.name}
                  onChange={(e) =>
                    handlePlayerNameChange(index, e.target.value)
                  }
                  className="text-center text-sm font-semibold text-gray-800"
                />
                <input
                  type="text"
                  value={player.position}
                  onChange={(e) =>
                    handlePlayerPositionChange(index, e.target.value)
                  }
                  className="text-center text-xs text-gray-500"
                />
              </div>
            </div>
          ))}
        </div>

        {/* Save Button */}
        <div className="mt-4 flex justify-center">
          <button
            onClick={handleSave}
            className="rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditPlayerSelection;
