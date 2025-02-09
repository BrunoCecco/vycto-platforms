import BlurImage from "@/components/media/blurImage";
import type { SelectSite } from "@/lib/schema";
import { getSiteDomain, placeholderBlurhash, random } from "@/lib/utils";
import { BarChart, ExternalLink } from "lucide-react";
import Link from "next/link";
import BannerMedia from "../media/bannerMedia";

export default function SiteCard({ data }: { data: SelectSite }) {
  const url = getSiteDomain(data);
  return (
    <div className="relative rounded-lg border  pb-10 shadow-md transition-all hover:shadow-xl ">
      <Link
        href={`/site/${data.id}`}
        className="flex flex-col overflow-hidden rounded-lg"
      >
        <div className="relative h-44 w-full">
          <BannerMedia
            // alt={data.name || "Card thumbnail"}
            // width={500}
            // height={400}
            // className="h-44 object-cover"
            src={data.image || "/placeholder.png"}
            // placeholder="blur"
            // blurDataURL={data.imageBlurhash || placeholderBlurhash}
          />
        </div>
        <div className="border-t  p-4 ">
          <h3 className="my-0 truncate text-xl font-bold tracking-wide ">
            {data.name}
          </h3>
          <p className="mt-2 line-clamp-1 text-sm font-normal leading-snug  ">
            {data.description}
          </p>
        </div>
      </Link>
      <div className="absolute bottom-4 flex w-full justify-between space-x-4 px-4">
        <a
          href={
            process.env.NEXT_PUBLIC_VERCEL_ENV
              ? url
              : `http://${data.subdomain}.localhost:3000`
          }
          target="_blank"
          rel="noreferrer"
          className="truncate rounded-md   px-2 py-1 text-sm font-medium  transition-colors   "
        >
          {url} ↗
        </a>
        <Link
          href={`/site/${data.id}/analytics`}
          className="flex items-center rounded-md bg-success-800 bg-opacity-50 px-2 py-1 text-sm font-medium text-success-600 transition-colors hover:bg-success-200 dark:bg-success-900 dark:bg-opacity-50 dark:text-success-400"
        >
          <BarChart height={16} />
          <p>{random(10, 40)}%</p>
        </Link>
      </div>
    </div>
  );
}
