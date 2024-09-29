import BlurImage from "@/components/images/blurImage";
import { getCompetitionUsers } from "@/lib/fetchers";
import type { SelectCompetition, SelectSite } from "@/lib/schema";
import { placeholderBlurhash } from "@/lib/utils";
import { ExternalLink, LinkIcon } from "lucide-react";
import Link from "next/link";

const EditCompetitionCard = async ({
  data,
}: {
  data: SelectCompetition & { site: SelectSite | null };
}) => {
  const users = await getCompetitionUsers(data.slug);

  const url = process.env.NEXT_PUBLIC_VERCEL_ENV
    ? `https://${data.site?.subdomain}.${process.env.NEXT_PUBLIC_ROOT_DOMAIN}/comp/${data.slug}`
    : `http://${data.site?.subdomain}.localhost:3000/comp/${data.slug}`;

  let status;
  if (new Date(data.date) > new Date()) {
    const days = Math.ceil(
      (new Date(data.date).getTime() - new Date().getTime()) /
        (1000 * 60 * 60 * 24),
    );
    status = days + " Days to go";
  } else if (new Date(data.date) < new Date()) {
    status = users.length + " Participants";
  } else {
    status = "Live";
  }

  return (
    <div className="rounded-lg border border-stone-200 bg-white shadow-md transition-all hover:shadow-xl dark:border-stone-700 dark:hover:border-white">
      <div className="relative h-48 w-full">
        <BlurImage
          alt={data.title ?? "Card thumbnail"}
          layout="fill"
          className="rounded-t-lg object-cover"
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

      <div className="flex h-40 flex-col justify-between px-4 pb-4 pt-2">
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
          <div
            className="flex items-center text-sm"
            style={{ color: data.site?.color2 || "#000" }}
          >
            <p>{status}</p>
            {data.published && (
              <a
                href={url}
                target="_blank"
                rel="noreferrer"
                className="ml-2 truncate rounded-md bg-stone-100 px-2 py-1 font-medium text-stone-600 transition-colors hover:bg-stone-200 dark:bg-stone-800 dark:text-stone-400 dark:hover:bg-stone-700"
              >
                <ExternalLink height={16} width={16} />
              </a>
            )}
          </div>
          <Link
            href={`/competition/${data.id}/editor`}
            className="w-24 rounded-lg p-2 text-center text-white hover:opacity-75"
            style={{ backgroundColor: data.site?.color2 || "black" }}
          >
            Edit
          </Link>
        </div>
      </div>
    </div>
  );
};

export default EditCompetitionCard;
