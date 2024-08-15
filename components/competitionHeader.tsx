"use client";

import BlurImage from "@/components/old-components/blur-image";
import MDX from "@/components/old-components/mdx";
import EnterCompetitionButton from "@/components/old-components/enter-competition-button";
import Image from "next/image";
import TabSelector from "./tabSelector";
import { placeholderBlurhash } from "@/lib/utils";

interface CompetitionHeaderProps {
  session: any;
  users: any;
  data: any;
}

const CompetitionHeader: React.FC<CompetitionHeaderProps> = ({
  session,
  users,
  data,
}) => {
  const isUserInCompetition =
    session?.user &&
    users &&
    users.find((u: { userId: any }) => u.userId === session.user.id);

  return (
    <div className="flex w-full flex-col items-center justify-center rounded-lg bg-white px-10 py-6 shadow-lg md:w-3/4 md:p-14 lg:w-3/5">
      {session?.user && users && !isUserInCompetition ? (
        <EnterCompetitionButton
          userId={session.user.id}
          username={session.user.username}
          competitionId={data.id}
        />
      ) : (
        <div className="font-bold italic">Entered</div>
      )}

      {/* Placeholder for Image or Graphic */}
      <div className="my-4 w-full overflow-hidden rounded-xl">
        <BlurImage
          alt={data.title ?? "Competition image"}
          width={1200}
          height={630}
          className="h-full w-full rounded-2xl object-cover"
          placeholder="blur"
          blurDataURL={data.imageBlurhash ?? placeholderBlurhash}
          src={data.image ?? "/placeholder.png"}
        />
      </div>

      {/* Text section */}
      <div className="mt-8 text-center font-bold text-stone-800">
        <h1 className="text-2xl md:text-3xl dark:text-white">
          Competicion: {data.title}
        </h1>
        <p className="m-auto w-10/12 pt-4 text-sm font-light text-stone-800 md:text-base dark:text-stone-300">
          {new Date(data.date).toLocaleDateString()}
        </p>
        <p className="pt-4 text-xl dark:text-stone-400">
          by <span className="text-green-500">{data.site?.name}</span>
        </p>
      </div>

      {/* Banner */}
      <div className="relative mt-8 h-32 w-full">
        <Image
          src={"/banner.jpg"}
          alt="Players Banner"
          layout="fill"
          objectFit="contain"
        />
      </div>
      <TabSelector />
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
