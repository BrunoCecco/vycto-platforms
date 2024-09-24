import Image from "next/image";
import Link from "next/link";
import { Plus } from "lucide-react";
import { SelectCompetition, SelectSite } from "@/lib/schema";
import BlurImage from "../images/blurImage";
import { capitalize, placeholderBlurhash } from "@/lib/utils";

export default function FanZoneHeader({
  data,
  latestCompetition,
}: {
  data: SelectSite;
  latestCompetition: SelectCompetition | null;
}) {
  return (
    <>
      <div className="mb-10 text-2xl font-bold">
        {capitalize(data.name || "")}
      </div>

      {/* Banner Section */}
      {data.image ? (
        <div className="h-36 w-full overflow-hidden rounded-xl sm:h-[30vw]">
          <BlurImage
            src={data.image ?? "/placeholder.png"}
            blurDataURL={placeholderBlurhash}
            unoptimized
            alt="Banner Image"
            fill
            className="object-contain object-center"
          />
        </div>
      ) : null}
    </>
  );
}
