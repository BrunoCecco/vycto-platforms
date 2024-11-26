"use client";
import { useState, FC } from "react";
import Image from "next/image";
import PointsBadge from "../competitions/pointsBadge";
import Submit from "./submit";
import QuestionResultBlock from "../competitions/questionResultBlock";
import FlipText from "../ui/flipText";

const PlayerComponent = ({
  name,
  image,
  selectedPlayer,
  setSelectedPlayer,
  disabled,
}: {
  name: string;
  image: string;
  selectedPlayer: string | null;
  setSelectedPlayer: (player: string) => void;
  disabled?: boolean;
}) => {
  return (
    <button
      className={`flex  cursor-pointer flex-col items-center rounded-lg border-2 p-2 shadow-sm transition duration-200 ${
        selectedPlayer === name ? "border-yellow-500" : "border-transparent"
      }`}
      disabled={disabled}
      type="submit"
      onClick={() => setSelectedPlayer(name)}
    >
      <Image
        src={image || "/player.png"}
        alt={name}
        width={128}
        height={96}
        className={`rounded-md object-cover object-center ${
          selectedPlayer !== name ? "opacity-50" : "opacity-100"
        }`}
      />
      <div className="mt-2 w-fit text-wrap text-center !text-black">{name}</div>
    </button>
  );
};

const PlayerSelection = ({ ...props }) => {
  const [selectedPlayer, setSelectedPlayer] = useState<string | null>(
    props.answer?.answer,
  );

  return (
    <div className="flex w-full items-center justify-center">
      <div className="relative w-full rounded-lg bg-white p-4 shadow-xl md:p-10">
        {/* Points Badge */}
        <PointsBadge points={props.points} color={props.color} />

        {/* Question */}
        <FlipText
          word={props.question}
          className="mb-1 text-center text-xl font-semibold text-gray-800"
        />
        <p className="mb-6 text-center text-gray-500">
          Select the correct answer
        </p>

        {/* Player Options */}
        <div className="grid grid-cols-2 gap-4">
          <Submit
            userId={props.userId}
            questionId={props.id}
            competitionId={props.competitionId}
            answer={props.answer1}
            onLocalAnswer={props.onLocalAnswer}
          >
            <PlayerComponent
              name={props.answer1}
              image={props.image1}
              selectedPlayer={selectedPlayer}
              setSelectedPlayer={setSelectedPlayer}
              disabled={props.disabled}
            />
          </Submit>
          <Submit
            userId={props.userId}
            questionId={props.id}
            competitionId={props.competitionId}
            answer={props.answer2}
            onLocalAnswer={props.onLocalAnswer}
          >
            <PlayerComponent
              name={props.answer2}
              image={props.image2}
              selectedPlayer={selectedPlayer}
              setSelectedPlayer={setSelectedPlayer}
              disabled={props.disabled}
            />
          </Submit>
          <Submit
            userId={props.userId}
            questionId={props.id}
            competitionId={props.competitionId}
            answer={props.answer3}
            onLocalAnswer={props.onLocalAnswer}
          >
            <PlayerComponent
              name={props.answer3}
              image={props.image3}
              selectedPlayer={selectedPlayer}
              setSelectedPlayer={setSelectedPlayer}
              disabled={props.disabled}
            />
          </Submit>
          <Submit
            userId={props.userId}
            questionId={props.id}
            competitionId={props.competitionId}
            answer={props.answer4}
            onLocalAnswer={props.onLocalAnswer}
          >
            <PlayerComponent
              name={props.answer4}
              image={props.image4}
              selectedPlayer={selectedPlayer}
              setSelectedPlayer={setSelectedPlayer}
              disabled={props.disabled}
            />
          </Submit>
        </div>
        {props.correctAnswer?.length > 0 ? (
          <QuestionResultBlock
            correctAnswer={props.correctAnswer}
            pointsEarned={parseFloat(props.answer?.points || "0").toFixed(2)}
            totalPoints={props.points?.toString()}
          />
        ) : null}
      </div>
    </div>
  );
};

export default PlayerSelection;
