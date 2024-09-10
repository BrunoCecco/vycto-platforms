import BlurImage from "@/components/old-components/blur-image";
import type { SelectCompetition, SelectSite } from "@/lib/schema";
import { placeholderBlurhash } from "@/lib/utils";
import Link from "next/link";

export default function CompetitionCard({
  data,
}: {
  data: SelectCompetition & { site: SelectSite | null };
}) {
  const url = `${data.site?.subdomain}.${process.env.NEXT_PUBLIC_ROOT_DOMAIN}/comp/${data.slug}`;

  return (
    <div className="rounded-xl border border-stone-200 bg-white p-4 shadow-md transition-all hover:shadow-xl dark:border-stone-700 dark:hover:border-white">
      {/* Image Section */}
      <div className="relative h-40 w-full">
        <BlurImage
          alt={data.title ?? "Card thumbnail"}
          layout="fill"
          objectFit="cover"
          className="rounded-xl"
          src={data.image ?? "/placeholder.png"}
          placeholder="blur"
          blurDataURL={data.imageBlurhash ?? placeholderBlurhash}
        />
        {!data.published && (
          <span className="absolute bottom-2 right-2 rounded-md border border-stone-200 bg-white px-3 py-0.5 text-sm font-medium text-stone-600 shadow-md">
            Draft
          </span>
        )}
      </div>

      {/* Title & Sponsor Section */}
      <div className="flex items-center justify-between py-2">
        <div>
          <h2 className="text-lg font-semibold text-gray-800 dark:text-white">
            {data.title}
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {data.sponsor}
          </p>
        </div>
      </div>

      {/* Status & Edit Button */}
      <div className="flex items-center justify-between">
        <p className="text-sm" style={{ color: data.site?.color2 || "#000" }}>
          {/* {data.status} */}X days to go?
        </p>
        <Link
          href={
            process.env.NEXT_PUBLIC_VERCEL_ENV
              ? `https://${url}`
              : `http://${data.site?.subdomain}.localhost:3000/comp/${data.slug}`
          }
          className="w-24 rounded-full bg-blue-600 p-2 text-center text-white hover:opacity-75"
        >
          Edit
        </Link>
      </div>
    </div>
  );
}
