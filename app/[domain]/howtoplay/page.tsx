import UserSettings from "@/components/settings/userSettings";
import { CardSpotlight } from "@/components/ui/cardSpotlight";
import { ArrowBigDown, ArrowDownNarrowWide } from "lucide-react";
import Image from "next/image";

export default async function HowToPlayPage() {
  // explain how to play with beautiful layouy
  return (
    <div className="flex flex-col gap-8">
      <h1 className="mb-6 text-3xl font-bold">How to Play</h1>

      <CardSpotlight className="flex flex-col items-center rounded-lg p-6 shadow-lg">
        <h2 className=" relative z-20 mb-4 text-2xl font-semibold">
          1. Enter a Competition
        </h2>
        <p className="relative z-20 mb-4 ">
          Browse our active competitions and click &ldquo;Play&ldquo;.
        </p>
        <Image
          src={"/playButton.png"}
          alt="Play Button"
          width={300}
          height={300}
          className="relative z-20 overflow-hidden rounded-md"
        />
      </CardSpotlight>

      <ArrowBigDown className="mx-auto h-12 w-12 " />

      <CardSpotlight className="flex flex-col items-center rounded-lg p-6 shadow-lg">
        <h2 className="relative z-20 mb-4 text-2xl font-semibold ">
          2. Answer Questions
        </h2>
        <p className="relative z-20 mb-4 ">Submit your answers!</p>
        <Image
          src={"/answerQuestion.png"}
          alt="Answer Questions"
          width={300}
          height={300}
          className="relative z-20 overflow-hidden rounded-md"
        />
      </CardSpotlight>

      <ArrowBigDown className="mx-auto h-12 w-12 " />

      <CardSpotlight className="flex flex-col items-center rounded-lg p-6 shadow-lg">
        <h2 className="relative z-20 mb-4 text-2xl font-semibold ">
          3. Earn Points
        </h2>
        <p className="relative z-20  mb-4 ">
          Points will be calculated after the event and you will be placed on a
          leaderboard.
        </p>
        <Image
          src={"/leaderboard.png"}
          alt="Leaderboard"
          width={400}
          height={400}
          className="relative z-20 overflow-hidden rounded-md"
        />
      </CardSpotlight>

      <ArrowBigDown className="mx-auto h-12 w-12 " />

      <CardSpotlight className="flex flex-col items-center rounded-lg p-6 shadow-lg">
        <h2 className="relative z-20  mb-4 text-2xl font-semibold ">
          4. Win Rewards
        </h2>
        <p className="relative z-20  mb-4 ">
          Top performers in each competition have a chance to win exciting
          rewards.
        </p>
        <p className="mb-4 ">
          Check the competition details for specific reward information.
        </p>
        <Image
          src={"/reward.png"}
          alt="Rewards"
          width={300}
          height={300}
          className="relative z-20 overflow-hidden rounded-md"
        />
      </CardSpotlight>
    </div>
  );
}
