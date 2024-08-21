"use client";
import EditGuessScore from "@/components/edit-questions/editGuessScore";
import EditMatchOutcome from "@/components/edit-questions/editMatchOutcome";
import EditPlayerGoals from "@/components/edit-questions/editPlayerGoals";
import EditPlayerSelection from "@/components/edit-questions/editPlayerSelection";
import GameStats from "@/components/gameStats";
import QuestionBuilder from "@/components/questionBuilder";
import GuessScore from "@/components/questions/guessScore";
import MatchOutcome from "@/components/questions/matchOutcome";
import PlayerGoals from "@/components/questions/playerGoals";
import PlayerSelection from "@/components/questions/playerSelection";
import WhatMinute from "@/components/questions/whatMinute";
import Signup from "@/components/signUp";

const homeTeam = {
  name: "Real Madrid",
  image: "/teamBadge.jpg",
  position: "Home",
};

const awayTeam = {
  name: "Chelsea",
  image: "/teamBadge.jpg",
  position: "Away",
};

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

export default function HomePage() {
  return (
    <div className="min-h-screen space-y-12 bg-green-100">
      <h1 className="text-2xl font-bold">Development Playground</h1>
      <Signup />
      <GameStats
        competitionTitle="Atletico vs Inter"
        username="nicolascastr0"
        submissionDate="09 May 2024"
        submissionTime="15:42"
        totalPoints={67.61}
        percentile="Top 4%"
        rank="33rd"
        bonusPoints={0.5}
      />
      {/* <EditGuessScore />
      <EditMatchOutcome />
      <EditPlayerGoals /> */}
      {/* <QuestionBuilder competitionId={"id"} initialQuestions={[]} /> */}
      <h1 className="text-2xl font-bold">
        All questions below have data passed in from props. Should be easier to
        populate now by setting props from DB data. If needed, answers can now
        easily be passed out too.
      </h1>
      <WhatMinute
        question="What minute will Atletico score vs Inter?"
        imageSrc="/trueFalse.jpg"
        points={5}
      />
      <MatchOutcome
        question="Real Madrid vs Chelsea"
        points={5}
        homeTeam={homeTeam}
        awayTeam={awayTeam}
      />
      <GuessScore homeTeam="Real Madrid" awayTeam="Chelsea" points={5} />
      <PlayerGoals
        question="How many goals will Morata score?"
        imageSrc="/trueFalse.jpg"
        points={5}
      />
      <PlayerSelection
        question="Who will score the 1st point?"
        points={5}
        players={players}
      />
    </div>
  );
}
