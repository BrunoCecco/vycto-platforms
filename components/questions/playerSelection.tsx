"use client";
import { useState, FC } from "react";
import Image from "next/image";
import PointsBadge from "../competitions/pointsBadge";
import Submit from "./submit";
import QuestionResultBlock from "../competitions/questionResultBlock";
import { Button, Card, CardFooter } from "@nextui-org/react";
import { TextGenerateEffect } from "../ui/textGenerateEffect";

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
    <Card
      isFooterBlurred
      className={`relative flex h-[140px] w-[100px] overflow-hidden rounded-lg shadow-sm transition duration-200 md:h-[220px] md:w-[180px] ${
        selectedPlayer?.trim() == name?.trim()
          ? "border-yellow-500 border-2"
          : "border-none"
      }`}
    >
      <Button
        disabled={disabled}
        type="submit"
        onClick={() => {
          setSelectedPlayer(name);
        }}
        className="relative h-full w-full rounded-none bg-none p-0"
      >
        <Image
          src={image || "/player.png"}
          alt={name}
          unoptimized
          fill
          className={`rounded-md object-cover object-center ${
            selectedPlayer !== name ? "opacity-50" : "opacity-100"
          }`}
        />
      </Button>
      <CardFooter className="absolute bottom-0 z-10 flex w-full justify-center overflow-hidden rounded-b-lg bg-background/20 py-1 text-center text-xs shadow-sm md:text-sm">
        {name}
      </CardFooter>
    </Card>
  );
};

const PlayerSelection = ({ ...props }) => {
  const [selectedPlayer, setSelectedPlayer] = useState<string | null>(
    props.answer?.answer,
  );

  return (
    <div className="flex w-full items-center justify-center">
      <div className="relative w-full rounded-lg p-4 shadow-xl">
        {/* Points Badge */}
        <PointsBadge points={props.points} color={props.color} />

        <TextGenerateEffect words={props.question || ""} color={props.color} />
        <p className="mb-6 text-center text-xs md:text-sm">
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
        {props.correctAnswer?.length > 0 && props.hasEnded ? (
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
