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
      <div className="flex h-full w-full flex-col justify-between rounded-lg bg-slate-800 p-8">
        <h2 className="text-2xl font-bold uppercase">{comp.rewardTitle}</h2>
        <div className="relative h-1/3 w-full">
          <Image
            src={comp.rewardImage ?? "/placeholder.png"}
            alt={comp.reward2Title ?? "Card thumbnail"}
            fill
            className="overflow-hidden rounded-lg object-contain"
          />
        </div>
        <div className="flex w-full items-center justify-between">
          <p className="rounded-full bg-slate-200 p-1 px-2 text-xs font-bold text-black">
            EXCLUSIVE PRIZE
          </p>
          <p className="text-sm text-slate-400">COMING SOON...</p>
        </div>
      </div>
    </BackgroundGradient>
  );
}
