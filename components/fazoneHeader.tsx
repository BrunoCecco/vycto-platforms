import Image from "next/image";
import Link from "next/link";
import { Plus } from "lucide-react";
import { SelectCompetition } from "@/lib/schema";

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
      <div className="ease left-0 right-0 top-0 z-30 flex transition-all duration-150 dark:text-white">
        <div className="my-6 mr-auto flex h-full max-w-screen-xl items-center justify-center space-x-5 sm:my-12">
          <Image
            className="rounded-xl"
            alt={data.name || ""}
            height={80}
            src={data.logo || ""}
            width={200}
          />
          <Link
            className="ml-3 rounded-full bg-blue-200 px-8 py-2 pt-1 font-semibold text-white"
            style={{ backgroundColor: data.color2 || "#1E40AF" }} // Default color fallback
            href={`/comp/${latestCompetition?.slug}` ?? "/"}
          >
            Play
          </Link>
        </div>
      </div>

      {/* Banner Section */}
      {data.image ? (
        <div className="mb-4 hidden h-44 w-full items-center justify-center overflow-hidden rounded-xl sm:flex">
          <Image
            src={data.image ?? "/placeholder.png"}
            unoptimized
            alt="Banner Image"
            width={1}
            height={1}
            objectFit="cover"
            className="h-100% w-auto"
          />
        </div>
      ) : null}
    </>
  );
}
