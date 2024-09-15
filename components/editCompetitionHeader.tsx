"use client";

import BlurImage from "@/components/old-components/blur-image";
import MDX from "@/components/old-components/mdx";
import Image from "next/image";
import TabSelector from "./tabSelector";
import { placeholderBlurhash } from "@/lib/utils";
import { DateTime } from "luxon";

const EditCompetitionHeader = ({}) => {
  return (
    <div className="mx-auto flex w-full flex-col items-center justify-center bg-white md:rounded-3xl">
      {/* Placeholder for Image or Graphic */}
      <div className="my-4 w-full overflow-hidden rounded-xl">
        <BlurImage
          alt={"Competition image"}
          width={1200}
          height={630}
          className="h-full w-full rounded-lg object-cover"
          placeholder="blur"
          blurDataURL={placeholderBlurhash}
          src={"/placeholder.png"}
        />
      </div>

      {/* Text section */}
      <div className="text-center text-stone-800">
        <h1 className="text-2xl font-bold md:text-3xl dark:text-white">
          Competition:
        </h1>
        <div className="pt-2 text-xl dark:text-stone-400">
          by <span className="text-green-500">placeholder</span>
        </div>
        <div className="m-auto w-10/12 pt-4 text-sm font-light text-stone-800 md:text-base dark:text-stone-300">
          {/* {DateTime.fromISO(data.date)
            .setLocale("en-UK")
            .toLocaleString(DateTime.DATE_FULL)} */}
        </div>
      </div>
    </div>
  );
};

export default EditCompetitionHeader;
