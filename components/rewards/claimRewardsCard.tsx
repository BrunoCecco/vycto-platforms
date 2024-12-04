"use client";
import { SelectCompetition, SelectSite, SelectSiteReward } from "@/lib/schema";
import { BackgroundGradient } from "../ui/backgroundGradient";
import Image from "next/image";
import { makeTransparent } from "@/lib/utils";

export default function ClaimRewardsCard({
  comp,
  latestReward,
  data,
}: {
  comp: SelectCompetition;
  latestReward: SelectSiteReward;
  data: SelectSite;
}) {
  return (
    <BackgroundGradient
      containerClassName="h-[350px] w-full rounded-lg p-1"
      className="flex h-full w-full flex-col justify-between"
      color1={data.color1}
      color2={makeTransparent(data.color1, 0.7)}
      color3={"#FFFFFF"}
      color4={makeTransparent(data.color1, 0)}
      color5={makeTransparent(data.color1, 0.7)}
    >
      <div className="flex h-full w-full flex-col justify-between rounded-lg bg-content3 p-8">
        <div className="relative h-2/3 w-full">
          <Image
            src={latestReward?.image || "/aelShirt.png"}
            alt={latestReward?.title || "Card thumbnail"}
            fill
            className="overflow-hidden rounded-lg object-contain"
          />
        </div>
        <h2 className="text-2xl font-bold uppercase">
          {latestReward?.title || "AEL Signed Shirt"}
        </h2>
        <div className="mt-2 text-xs font-bold">
          {latestReward?.description ||
            "This AEL signed shirt, autographed by all 22 player, stands as a powerful emblem of pride for an entire city."}
        </div>
        <div className="mt-4 flex w-full flex-wrap items-center justify-between gap-4">
          <p className="rounded-full bg-content4 p-1 px-2 text-xs font-bold">
            EXCLUSIVE PRIZE
          </p>
          <p className="text-sm ">COMING SOON...</p>
        </div>
      </div>
    </BackgroundGradient>
  );
}
