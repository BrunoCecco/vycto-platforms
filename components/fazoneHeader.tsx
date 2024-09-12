import Image from "next/image";
import Link from "next/link";
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
          <div className="">
            <Image
              alt={data.name || ""}
              height={80}
              src={data.logo || ""}
              width={200}
            />
          </div>
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
      <div className="mb-6 mr-auto flex h-full max-w-screen-xl items-center justify-center space-x-5 sm:mb-12">
        <Image
          alt={"Banner image"}
          width={1200}
          height={630}
          className="h-full w-full object-cover"
          src={data.image ?? "/placeholder.png"}
        />
      </div>
    </>
  );
}
