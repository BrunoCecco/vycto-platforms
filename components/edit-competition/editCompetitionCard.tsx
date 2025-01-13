import BlurImage from "@/components/media/blurImage";
import { getCompetitionUsers } from "@/lib/fetchers";
import type { SelectCompetition, SelectSite } from "@/lib/schema";
import { placeholderBlurhash } from "@/lib/utils";
import { Link } from "@nextui-org/react";
import { ExternalLink, LinkIcon } from "lucide-react";

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
  if (new Date(data.date.replace(/\[.*\]$/, "")) > new Date()) {
    const days = Math.ceil(
      (new Date(data.date.replace(/\[.*\]$/, "")).getTime() -
        new Date().getTime()) /
        (1000 * 60 * 60 * 24),
    );
    status = days + " Days to go";
  } else if (new Date(data.date.replace(/\[.*\]$/, "")) < new Date()) {
    status = users.length + " Participants";
  } else {
    status = "Live";
  }

  return (
    <div className="rounded-lg border shadow-md transition-all hover:shadow-xl">
      <div className="relative h-48 w-full">
        <BlurImage
          alt={data.title || "Card thumbnail"}
          fill
          className="rounded-t-lg object-cover"
          src={data.image || "/placeholder.png"}
          placeholder="blur"
          blurDataURL={data.imageBlurhash || placeholderBlurhash}
        />
        {!data.published && (
          <span className="absolute bottom-2 right-2 rounded-md border bg-background/60 px-3  py-0.5 text-sm font-medium shadow-md  backdrop-blur-sm">
            Draft
          </span>
        )}
      </div>

      <div className="flex h-32 flex-col justify-between px-4 pb-4 pt-2 text-left">
        {/* Title & Sponsor Section */}
        <div>
          <h2 className="font-semibold">{data.title}</h2>
          <p className="text-sm  ">{data.sponsor}</p>
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
                className="ml-2 truncate rounded-md  px-2 py-1 font-medium  transition-colors "
              >
                <ExternalLink height={16} width={16} />
              </a>
            )}
          </div>
          <Link
            href={`/competition/${data.id}/editor`}
            className="rounded-lg bg-content3 px-4 py-2 text-center text-foreground hover:opacity-75"
          >
            Edit
          </Link>
        </div>
      </div>
    </div>
  );
};

export default EditCompetitionCard;
