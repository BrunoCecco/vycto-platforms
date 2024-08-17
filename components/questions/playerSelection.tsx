"use client";
import { useState, FC } from "react";
import Image from "next/image";
import PointsBadge from "../pointsBadge";
import Submit from "./submit";

const PlayerComponent = ({
  name,
  image,
  selectedPlayer,
  setSelectedPlayer,
}: {
  name: string;
  image: string;
  selectedPlayer: string | null;
  setSelectedPlayer: (player: string) => void;
}) => {
  return (
    <button
      className={`cursor-pointer rounded-lg border-2 p-2 shadow-sm transition duration-200 ${
        selectedPlayer === name ? "border-yellow-500" : "border-transparent"
      }`}
      type="submit"
      onClick={() => setSelectedPlayer(name)}
    >
      <Image
        src={image || "/player.png"}
        alt={name}
        layout="responsive"
        width={128}
        height={96}
        objectFit="cover"
        className={`rounded-md ${
          selectedPlayer !== name ? "opacity-50" : "opacity-100"
        }`}
      />
      <div className="mt-2 text-center">{name}</div>
    </button>
  );
};

const PlayerSelection = ({ ...props }) => {
  const [selectedPlayer, setSelectedPlayer] = useState<string | null>(
    props.answer,
  );

  return (
    <div className="flex items-center justify-center">
      <div className="relative w-full rounded-lg bg-white p-4 shadow-xl md:w-1/2 md:p-10">
        {/* Points Badge */}
        <PointsBadge points={props.points} />

        {/* Question */}
        <h2 className="mb-2 text-center text-xl font-semibold text-gray-800">
          {props.question}
        </h2>
        <p className="mb-6 text-center text-gray-500">
          Select the correct answer
        </p>

        {/* Player Options */}
        <div className="grid grid-cols-2 gap-4">
          <Submit
            userId={props.userId}
            questionId={props.id}
            answer={props.answer1}
          >
            <PlayerComponent
              name={props.answer1}
              image={props.image1}
              selectedPlayer={selectedPlayer}
              setSelectedPlayer={setSelectedPlayer}
            />
          </Submit>
          <Submit
            userId={props.userId}
            questionId={props.id}
            answer={props.answer2}
          >
            <PlayerComponent
              name={props.answer2}
              image={props.image2}
              selectedPlayer={selectedPlayer}
              setSelectedPlayer={setSelectedPlayer}
            />
          </Submit>
          <Submit
            userId={props.userId}
            questionId={props.id}
            answer={props.answer3}
          >
            <PlayerComponent
              name={props.answer3}
              image={props.image3}
              selectedPlayer={selectedPlayer}
              setSelectedPlayer={setSelectedPlayer}
            />
          </Submit>
          <Submit
            userId={props.userId}
            questionId={props.id}
            answer={props.answer4}
          >
            <PlayerComponent
              name={props.answer4}
              image={props.image4}
              selectedPlayer={selectedPlayer}
              setSelectedPlayer={setSelectedPlayer}
            />
          </Submit>
        </div>
      </div>
    </div>
  );
};

export default PlayerSelection;
