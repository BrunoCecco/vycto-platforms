"use client";
import React from "react";
import { BackgroundBeams } from "@/components/ui/backgroundBeams";
import { TextGenerateEffect } from "../ui/textGenerateEffect";
import { SelectSite } from "@/lib/schema";

export function Story({ siteData }: { siteData: SelectSite }) {
  const words = `
${siteData.name}  is not just a club; it is the pride of our city. 

A symbol of resilience, passion, and unrelenting spirit since 1930.

17 trophies — 6 First Division titles, 7 Cups, and 4 Super Cups

 We are the most decorated club in Limassol. 

Or story is far from over.`;

  return (
    <div className="relative flex h-full w-full flex-col items-center justify-center overflow-auto rounded-md antialiased dark:bg-neutral-950">
      <div className="mx-auto p-4">
        <h1 className="relative z-10 bg-gradient-to-b from-neutral-200  to-neutral-600 bg-clip-text text-center font-sans text-lg  font-bold text-transparent md:text-7xl">
          Join the {siteData.name} family
        </h1>
        <p></p>
        <TextGenerateEffect words={words} />
      </div>
      <BackgroundBeams />
    </div>
  );
}
