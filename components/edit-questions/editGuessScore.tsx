"use client";
import { useState } from "react";
import PointsBadge from "../pointsBadge";
import { PlusCircle, MinusCircle } from "lucide-react";

const EditGuessScore = () => {
  const [scoreHome, setScoreHome] = useState(0);
  const [scoreAway, setScoreAway] = useState(0);

  const [isEditingHome, setIsEditingHome] = useState(false);
  const [isEditingAway, setIsEditingAway] = useState(false);
  const [isEditingPoints, setIsEditingPoints] = useState(false);

  const [homeTeam, setHomeTeam] = useState("Home Team");
  const [awayTeam, setAwayTeam] = useState("Away Team");
  const [points, setPoints] = useState(0);

  const handleInputChange =
    (setValue: (value: string) => void) =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setValue(e.target.value);
    };

  const handlePointsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPoints(parseInt(e.target.value) || 0);
  };

  const handleRemove = async () => {
    if (!confirm("Are you sure you want to remove this question?")) return;
    // removeQuestion(question.id);
  };

  return (
    <div className="flex items-center justify-center">
      <div className="relative w-full rounded-lg bg-white p-4 shadow-xl md:p-10">
        {/* Editable Points Badge */}
        <div className="mb-4 flex justify-center">
          {isEditingPoints ? (
            <input
              type="number"
              value={points}
              onChange={handlePointsChange}
              onBlur={() => setIsEditingPoints(false)}
              autoFocus
              className="w-20 border-b-2 border-gray-300 text-center text-xl font-semibold text-gray-800"
            />
          ) : (
            <div onClick={() => setIsEditingPoints(true)}>
              <PointsBadge points={points} />
            </div>
          )}
        </div>

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
              <button onClick={() => setScoreHome(scoreHome + 1)}>
                <PlusCircle />
              </button>
            </div>
            {isEditingHome ? (
              <input
                type="text"
                value={homeTeam}
                onChange={handleInputChange(setHomeTeam)}
                onBlur={() => setIsEditingHome(false)}
                autoFocus
                className="border-b-2 border-gray-300 text-center text-sm font-semibold text-gray-800"
              />
            ) : (
              <p
                className="cursor-pointer border-2 text-sm font-semibold"
                onClick={() => setIsEditingHome(true)}
              >
                {homeTeam}
              </p>
            )}
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
              <button onClick={() => setScoreAway(scoreAway + 1)}>
                <PlusCircle />
              </button>
            </div>
            {isEditingAway ? (
              <input
                type="text"
                value={awayTeam}
                onChange={handleInputChange(setAwayTeam)}
                onBlur={() => setIsEditingAway(false)}
                autoFocus
                className="border-b-2 border-gray-300 text-center text-sm font-semibold text-gray-800"
              />
            ) : (
              <p
                className="cursor-pointer border-2 text-sm font-semibold"
                onClick={() => setIsEditingAway(true)}
              >
                {awayTeam}
              </p>
            )}
          </div>
        </div>

        {/* Save Button */}
        <div className="mt-4 flex flex-col items-center justify-center gap-4">
          <label htmlFor="correctAnswer" className="text-center">
            Correct Answer:
          </label>
          <input
            type="text"
            // value={question.correctAnswer || editedCorrectAnswer}
            // onChange={handleCorrectAnswerInputChange}
            // onBlur={() => handleInputBlur("correctAnswer", editedCorrectAnswer)}
            placeholder="0 - 0"
            autoFocus
            className="mt-1 block w-full rounded-md border border-stone-200 text-center dark:border-stone-700"
          />
          <button
            onClick={handleRemove}
            className="rounded bg-red-500 px-4 py-2 text-white hover:bg-red-600"
          >
            Remove
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditGuessScore;
