import UserSettings from "@/components/settings/userSettings";
import { CardSpotlight } from "@/components/ui/cardSpotlight";
import { getSiteData } from "@/lib/fetchers";
import { ArrowBigDown, ArrowDownNarrowWide } from "lucide-react";
import Image from "next/image";

const Arrow = () => (
  <div className="rounded-full">
    <ArrowBigDown className="mx-auto h-12 w-12 " />
  </div>
);

const HelpCard = ({
  src,
  color,
  children,
}: {
  src: string;
  color?: string;
  children: React.ReactNode;
}) => (
  <CardSpotlight
    className="flex flex-col items-center rounded-lg p-6 shadow-lg"
    color={color}
  >
    {children}
    <Image
      src={src}
      alt="Answer Questions"
      width={300}
      height={300}
      className="relative z-20 overflow-hidden rounded-md"
    />
  </CardSpotlight>
);

export default async function HowToPlayPage({
  params,
}: {
  params: { domain: string };
}) {
  const domain = decodeURIComponent(params.domain);
  const data = await getSiteData(domain);

  return (
    <div className="flex flex-col gap-8">
      <h1 className="mb-6 text-3xl font-bold">How to Play</h1>

      <HelpCard src="/playButton.png" color={data?.color1}>
        <h2 className=" relative z-20 mb-4 text-2xl font-semibold">
          1. Enter a Competition
        </h2>
        <p className="relative z-20 mb-4 ">
          Browse our active competitions and click &ldquo;Play&ldquo;.
        </p>
      </HelpCard>

      <Arrow />

      <HelpCard src="/answerQuestion.png" color={data?.color1}>
        <h2 className="relative z-20 mb-4 text-2xl font-semibold ">
          2. Answer Questions
        </h2>
        <p className="relative z-20 mb-4 ">Submit your answers!</p>
      </HelpCard>

      <Arrow />

      <HelpCard src="/leaderboard.png" color={data?.color1}>
        <h2 className="relative z-20 mb-4 text-2xl font-semibold ">
          3. Earn Points
        </h2>
        <p className="relative z-20  mb-4 ">
          Points will be calculated after the event and you will be placed on a
          leaderboard.
        </p>
      </HelpCard>

      <Arrow />

      <HelpCard src="/reward.png" color={data?.color1}>
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
      </HelpCard>
    </div>
  );
}
