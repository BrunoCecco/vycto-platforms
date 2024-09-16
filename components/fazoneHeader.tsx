import Image from "next/image";
import Link from "next/link";
import { Plus } from "lucide-react";
import { SelectCompetition } from "@/lib/schema";
import BlurImage from "./old-components/blur-image";
import { placeholderBlurhash } from "@/lib/utils";

export default function FanZoneHeader({
  data,
  latestCompetition,
}: {
  data: {
    name: string | null;
    logo: string | null;
    image: string | null;
    color2: string | null;
  };
  latestCompetition: SelectCompetition | null;
}) {
  return (
    <>
      {/* Top Header Section */}
      {/* <div className="ease left-0 right-0 top-0 z-30 flex transition-all duration-150 dark:text-white">
        <div className="mb-6 mr-auto flex h-32 max-w-screen-xl flex-wrap items-center justify-center space-x-5 overflow-hidden sm:my-12">
          <Image
            className="rounded-xl"
            alt={data.name || ""}
            height={80}
            src={data.logo || ""}
            width={250}
          />
          <Link
            className="ml-3 rounded-full bg-blue-200 px-8 py-2 pt-1 font-semibold text-white"
            style={{ backgroundColor: data.color2 || "#1E40AF" }} // Default color fallback
            href={`/comp/${latestCompetition?.slug}` ?? "/"}
          >
            Play
          </Link>
        </div>
      </div> */}

      {/* Banner Section */}
      {data.image ? (
        <div className="mb-4 flex h-20 w-full items-center justify-center overflow-hidden rounded-xl sm:h-44">
          <BlurImage
            src={data.image ?? "/placeholder.png"}
            blurDataURL={placeholderBlurhash}
            unoptimized
            alt="Banner Image"
            fill
            className="h-full w-full object-cover object-center"
          />
        </div>
      ) : null}
    </>
  );
}
