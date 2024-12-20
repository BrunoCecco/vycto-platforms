"use client";
import React from "react";
import { BackgroundBeams } from "@/components/ui/backgroundBeams";
import { TextGenerateEffect } from "../ui/textGenerateEffect";
import { SelectSite } from "@/lib/schema";

export function Story({ siteData }: { siteData: SelectSite }) {
  return (
    <div className="relative flex h-full w-full flex-col items-center justify-center overflow-auto rounded-md antialiased">
      <div className="mx-auto p-4">
        <h1 className="relative z-10 bg-gradient-to-b from-default-400 to-default-600  bg-clip-text p-2 text-center font-sans text-2xl  font-bold text-transparent md:text-6xl">
          Join the {siteData.name} family
        </h1>
        <TextGenerateEffect words={siteData.story || ""} />
      </div>
      <BackgroundBeams />
    </div>
  );
}
