import Image from "next/image";
import Link from "next/link";
import { Plus } from "lucide-react";
import { SelectCompetition, SelectSite } from "@/lib/schema";
import BlurImage from "../media/blurImage";
import { capitalize, placeholderBlurhash } from "@/lib/utils";
import BannerMedia from "../media/bannerMedia";

export default function FanZoneHeader({
  data,
  latestCompetition,
}: {
  data: SelectSite;
  latestCompetition: SelectCompetition | null;
}) {
  return (
    <>
      <div className="text-2xl font-bold md:mb-10">
        {capitalize(data.name || "")}
      </div>

      {/* Banner Section */}
      {/* <div className="h-36 w-full overflow-hidden rounded-xl sm:h-[30vw]">
        {data.image ? <BannerMedia src={data.image} /> : null}
      </div> */}
      {/* Banner */}
      <div className="relative mt-4 h-24 w-full overflow-hidden rounded-lg md:h-40">
        <BlurImage
          src={data.image ?? "/logo.png"}
          blurDataURL={data.imageBlurhash ?? placeholderBlurhash}
          alt="Players Banner"
          className="object-cover"
          fill={true}
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
      </div>
    </>
  );
}
