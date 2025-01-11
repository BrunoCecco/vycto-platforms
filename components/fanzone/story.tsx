"use client";
import React from "react";
import { BackgroundBeams } from "@/components/ui/backgroundBeams";
import { TextGenerateEffect } from "../ui/textGenerateEffect";
import { SelectSite } from "@/lib/schema";
import { useTranslations } from "next-intl";

export function Story({ siteData }: { siteData: SelectSite }) {
  const t = useTranslations();
  return (
    <div className="relative flex h-full w-full flex-col items-center justify-center overflow-auto rounded-md antialiased">
      <div className="mx-auto p-4">
        <h1 className="relative z-10 bg-gradient-to-b from-default-400 to-default-600  bg-clip-text p-2 text-center font-sans text-2xl  font-bold text-transparent md:text-6xl">
          {t("joinfamily").replace("<site>",siteData.name)}
        </h1>
        <TextGenerateEffect words={siteData.story || ""} />
      </div>
      <BackgroundBeams />
    </div>
  );
}
