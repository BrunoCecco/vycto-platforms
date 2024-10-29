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
      {/* Banner Section */}
      <div className="h-36 rounded-xl shadow-lg sm:h-[30vw] xl:h-[20vw]">
        <div className="relative h-full w-full overflow-hidden rounded-xl">
          {data.image ? <BannerMedia src={data.image} /> : null}
        </div>
      </div>
    </>
  );
}
