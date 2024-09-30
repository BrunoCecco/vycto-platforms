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
      <div className="mb-10 text-2xl font-bold">
        {capitalize(data.name || "")}
      </div>

      {/* Banner Section */}
      <div className="h-36 w-full overflow-hidden rounded-xl sm:h-[30vw]">
        {data.image ? <BannerMedia src={data.image} /> : null}
      </div>
    </>
  );
}
