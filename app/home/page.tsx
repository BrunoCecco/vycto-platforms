import FanZone from "@/components/fanZone";
import GuessScore from "@/components/questions/guessScore";
import MatchOutcome from "@/components/questions/matchOutcome";
import PlayerGoals from "@/components/questions/playerGoals";
import PlayerSelection from "@/components/questions/playerSelection";
import TrueFalse from "@/components/questions/trueFalse";
import WhatMinute from "@/components/questions/whatMinute";

export default function HomePage() {
  const bannerImages = {
    logoPlaySrc: "/logoPlay.png",
    bannerSrc: "/banner.jpg",
  };

  const currentCompetitions = [
    {
      imageSrc: "/atletiCurrent.jpg",
      title: "Atletico vs Inter",
      sponsor: "Tanqueray",
      statusInfo: "24 hours left",
    },
    {
      imageSrc: "/atletiCurrent.jpg",
      title: "Atletico vs Athletic",
      sponsor: "Tanqueray",
      statusInfo: "24 hours left",
    },
  ];

  const pastCompetitions = [
    {
      imageSrc: "/atletiPast.jpg",
      title: "Atletico vs Alaves",
      sponsor: "Tanqueray",
      statusInfo: "2.72K participants",
    },
    {
      imageSrc: "/atletiPast.jpg",
      title: "Atletico vs Inter Miami",
      sponsor: "Tanqueray",
      statusInfo: "902 participants",
    },
  ];

  return (
    <div className="min-h-screen space-y-12 bg-green-100 p-8">
      <h1 className="text-2xl font-bold">Component Showcase</h1>
      <FanZone
        bannerImages={bannerImages}
        currentCompetitions={currentCompetitions}
        pastCompetitions={pastCompetitions}
      />
      <TrueFalse />
      <WhatMinute />
      <MatchOutcome />
      <GuessScore />
      <PlayerGoals />
      <PlayerSelection />
    </div>
  );
}
