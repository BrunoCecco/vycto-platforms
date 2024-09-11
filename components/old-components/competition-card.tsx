import BlurImage from "@/components/old-components/blur-image";
import { getCompetitionUsers } from "@/lib/fetchers";
import type { SelectCompetition, SelectSite } from "@/lib/schema";
import { placeholderBlurhash } from "@/lib/utils";
import Link from "next/link";

const CompetitionCard = async ({
  data,
}: {
  data: SelectCompetition & { site: SelectSite | null };
}) => {
  const users = await getCompetitionUsers(data.slug);

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
          {status}
        </p>
        <Link
          href={`/competition/${data.id}/editor`}
          className="w-24 rounded-full bg-blue-600 p-2 text-center text-white hover:opacity-75"
        >
          Edit
        </Link>
      </div>
    </div>
  );
};

export default CompetitionCard;
