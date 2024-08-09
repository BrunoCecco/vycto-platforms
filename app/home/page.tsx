import CompetitionCard from "@/components/competitionCard";
import { InlineSnippet } from "@/components/form/domain-configuration";
import Leaderboard from "@/components/leaderboard";
import Image from "next/image";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-green-100">
      <h1 className="p-6 text-2xl font-bold">Component Showcase</h1>
      <div className="flex h-screen items-center justify-center space-x-6">
        <CompetitionCard
          imageSrc="/atletiCurrent.jpg"
          title="Atletico vs Inter"
          sponsor="Tanqueray"
          timeLeft="24 hours left"
        />
        <CompetitionCard
          imageSrc="/atletiPast.jpg"
          title="Atletico vs Inter"
          sponsor="Tanqueray"
          timeLeft="24 hours left"
        />
      </div>
      <Leaderboard />
    </div>
  );
}
