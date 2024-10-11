"use client";
import { SelectCompetition } from "@/lib/schema";
import Button from "../buttons/button";
import { BackgroundGradient } from "../ui/backgroundGradient";
import Image from "next/image";

export default function ClaimRewardsCard({
  comp,
}: {
  comp: SelectCompetition;
}) {
  return (
    <BackgroundGradient
      containerClassName="h-[350px] w-full rounded-lg p-1"
      className="flex h-full w-full flex-col justify-between"
    >
      <div className="h-full w-full rounded-lg bg-slate-800 p-8">
        <Image
          src={comp.rewardImage ?? "/placeholder.png"}
          alt={comp.reward2Title ?? "Card thumbnail"}
          fill
          className="rounded-lg object-cover"
        />
        <h2 className="mb-2 text-2xl font-bold uppercase">
          {comp.rewardTitle}
        </h2>
        <div className="flex w-full items-center justify-between">
          <p className="rounded-full bg-slate-200 p-1 px-2 text-xs font-bold text-black">
            EXCLUSIVE PRIZE
          </p>
          <p className="text-sm text-slate-400">COMING SOON...</p>
        </div>
        {/* <div className="flex flex-wrap items-center justify-between gap-4">
        <span className="rounded bg-gradient-to-br from-orange-500 to-orange-300 px-3 py-1 text-sm text-black">
          APOEL VS OMONOIA
          <br />
          7TH PLACE
        </span>
        <Button>CLAIM</Button>
      </div> */}
      </div>
    </BackgroundGradient>
  );
}
