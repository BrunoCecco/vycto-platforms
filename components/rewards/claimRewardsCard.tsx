"use client";
import { SelectCompetition, SelectSite, SelectSiteReward } from "@/lib/schema";
import { BackgroundGradient } from "../ui/backgroundGradient";
import Image from "next/image";
import { makeTransparent } from "@/lib/utils";

export default function ClaimRewardsCard({
  reward,
  data,
}: {
  reward: SelectSiteReward;
  data: SelectSite;
}) {
  console.log(reward);
  return (
    <BackgroundGradient
      containerClassName="h-[350px] w-full rounded-lg p-1"
      className="flex h-full w-full flex-col justify-between overflow-hidden"
      color1={data.color1}
      color2={makeTransparent(data.color1, 0.7)}
      color3={"#FFFFFF"}
      color4={makeTransparent(data.color1, 0)}
      color5={makeTransparent(data.color1, 0.7)}
    >
      <div className="flex h-[350px] w-full flex-col justify-around overflow-hidden rounded-lg bg-content3 p-4 text-center">
        <div className="relative h-[90px] w-full">
          <Image
            src={reward?.image2 || "/aelShirt.png"}
            alt={reward?.title || "Card thumbnail"}
            fill
            className="overflow-hidden rounded-lg object-contain"
          />
        </div>
        <h2 className="text-lg font-bold uppercase">
          {reward?.title || "AEL Signed Shirt"}
        </h2>
        <div className="mt-2 text-xs font-bold">
          {reward?.description ||
            "This AEL signed shirt, autographed by all 22 player, stands as a powerful emblem of pride for an entire city."}
        </div>
        <div className="mt-4 flex w-full flex-col items-center justify-center gap-4">
          <p className="rounded-full bg-content4 p-1 px-2 text-xs font-bold">
            EXCLUSIVE PRIZE
          </p>
          <p className="text-sm ">COMING SOON...</p>
        </div>
      </div>
    </BackgroundGradient>
  );
}
