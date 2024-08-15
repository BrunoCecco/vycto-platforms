"use client";
import EditPlayerSelection from "@/components/edit-questions/editPlayerSelection";
import EditWhatMinute from "@/components/edit-questions/editWhatMinute";
import FanZone from "@/components/fanZone";
import QuestionBuilder from "@/components/questionBuilder";
import GuessScore from "@/components/questions/guessScore";
import MatchOutcome from "@/components/questions/matchOutcome";
import PlayerGoals from "@/components/questions/playerGoals";
import PlayerSelection from "@/components/questions/playerSelection";
import WhatMinute from "@/components/questions/whatMinute";

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
    <div className="min-h-screen space-y-12 bg-green-100 p-8">
      <h1 className="text-2xl font-bold">Playground</h1>
      <h1 className="text-2xl font-bold">
        Here is the question builder. When you select a question you can click
        on points, question etc to edit.
      </h1>
      <QuestionBuilder />
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
