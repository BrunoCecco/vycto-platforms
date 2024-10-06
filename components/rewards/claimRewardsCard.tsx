"use client";
import Button from "../buttons/button";
import { BackgroundGradient } from "../ui/backgroundGradient";

export default function ClaimRewardsCard() {
  return (
    <BackgroundGradient
      containerClassName="h-[300px] w-full rounded-lg p-8"
      className="flex h-full w-full flex-col justify-between"
    >
      <h2 className="mb-2 text-2xl font-bold">
        CABLENET PURPLE MAX (3 MONTHS)
      </h2>
      <p className="mb-4 text-xl">€ 45.00</p>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <span className="rounded bg-gradient-to-br from-orange-500 to-orange-300 px-3 py-1 text-sm text-black">
          APOEL VS OMONOIA
          <br />
          7TH PLACE
        </span>
        <Button>CLAIM</Button>
      </div>
    </BackgroundGradient>
  );
}
