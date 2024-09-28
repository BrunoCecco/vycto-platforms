"use client";

import BlurImage from "@/components/images/blurImage";
import { placeholderBlurhash } from "@/lib/utils";
import { DateTime } from "luxon";
import { SelectSite } from "@/lib/schema";

interface CompetitionHeaderProps {
  session: any;
  users: any;
  data: any;
  siteData: SelectSite;
}

const CompetitionHeader: React.FC<CompetitionHeaderProps> = ({
  session,
  users,
  data,
  siteData,
}) => {
  const isUserInCompetition =
    session?.user &&
    users &&
    users.find((u: { userId: any }) => u.userId === session.user.id);

  return (
    <div className="mx-auto flex w-full flex-col items-center justify-center bg-white md:rounded-3xl">
      {/* Placeholder for Image or Graphic */}
      <div className="my-4 w-full overflow-hidden rounded-xl">
        <BlurImage
          alt={data.title ?? "Competition image"}
          width={1200}
          height={630}
          className="h-full w-full rounded-lg object-cover"
          placeholder="blur"
          blurDataURL={data.imageBlurhash ?? placeholderBlurhash}
          src={data.image ?? "/placeholder.png"}
        />
      </div>

      {/* Text section */}
      <div className="text-center text-stone-800">
        <h1 className="text-2xl font-bold md:text-3xl ">
          Competition: {data.title}
        </h1>
        <div className="pt-2 text-xl ">
          by <span style={{ color: data.site?.color2 }}>{data.site?.name}</span>
        </div>
        <div className="m-auto w-10/12 pt-4 text-sm font-light text-stone-800 md:text-base ">
          {DateTime.fromISO(data.date)
            .setLocale("en-UK")
            .toLocaleString(DateTime.DATE_FULL)}
        </div>
      </div>

      {/* Banner */}
      <div className="relative mt-4 h-14 w-full overflow-hidden rounded-lg md:h-32">
        <BlurImage
          src={siteData.image ?? "/logo.png"}
          blurDataURL={siteData.imageBlurhash ?? placeholderBlurhash}
          alt="Players Banner"
          className="object-cover"
          fill={true}
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
      </div>
      {/* Uncomment if needed */}
      {/* <div className="my-8">
        <div className="relative inline-block h-8 w-8 overflow-hidden rounded-full align-middle md:h-12 md:w-12">
          <BlurImage
            alt={"User Avatar"}
            height={80}
            src={
              data.site?.user?.image ??
              `https://avatar.vercel.sh/${data.title}`
            }
            width={80}
          />
        </div>
        <div className="text-md ml-3 inline-block align-middle md:text-lg dark:text-white">
          by{" "}
          <span className="font-semibold">
            {data?.site?.user?.name ??
              data?.site?.user?.username ??
              data?.site?.user?.email}
          </span>
        </div>
      </div> */}
    </div>
  );
};

export default CompetitionHeader;
