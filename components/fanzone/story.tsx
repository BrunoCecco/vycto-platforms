"use client";
import React from "react";
import { BackgroundBeams } from "@/components/ui/backgroundBeams";
import { TextGenerateEffect } from "../ui/textGenerateEffect";

export function Story() {
  const words1 = "AEL is not just a club; it is the pride of an entire city.";
  const words2 =
    "A symbol of resilience, passion and unrelenting spirit since its founding in 1930.";
  const words3 =
    "17 trophies - 6 First Division titles, 7 Cups and 4 Super Cups - we are the most decorated club in Limassol";
  const words4 =
    "Our story is far from over, we want you to be a part of every victory, every chant, every unforgettable moment. Stay connected. Love, AEL.";

  return (
    <div className="relative flex h-full w-full flex-col items-center justify-center overflow-auto rounded-md bg-neutral-950 antialiased">
      <div className="mx-auto p-4">
        <h1 className="relative z-10 bg-gradient-to-b from-neutral-200  to-neutral-600 bg-clip-text text-center font-sans text-lg  font-bold text-transparent md:text-7xl">
          Join the AEL family
        </h1>
        <p></p>
        <TextGenerateEffect words={words1} />
        <TextGenerateEffect words={words2} />
        <TextGenerateEffect words={words3} />
        <TextGenerateEffect words={words4} />
      </div>
      <BackgroundBeams />
    </div>
  );
}
