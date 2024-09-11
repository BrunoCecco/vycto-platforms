import { getSession } from "@/lib/auth";
import { notFound, redirect } from "next/navigation";
import CombinedForm from "@/components/form/combined";
import { updateCompetitionMetadata } from "@/lib/actions";
import db from "@/lib/db";
import Form from "@/components/form";
import { getCompetitionWinnerData } from "@/lib/fetchers";
import Image from "next/image";
import Link from "next/link";
import { SelectUserCompetition } from "@/lib/schema";

const User = ({
  user,
  index,
  url,
}: {
  user: SelectUserCompetition;
  index: number;
  url: string;
}) => {
  return (
    <div key={user.userId} className="flex w-full items-center gap-4 border-b">
      <div className="pr-2 text-gray-900">{index + 1}</div>
      <div className="flex items-center py-4">
        <div className="relative inline-block h-8 w-8 overflow-hidden rounded-full align-middle">
          <Image
            src={`https://avatar.vercel.sh/${user.username}`}
            alt="Profile"
            fill={true}
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            objectFit="cover"
            className="overflow-hidden rounded-full"
          />
        </div>
        <span className="ml-2 font-bold text-gray-900">
          @{user.username || "User"}
        </span>
      </div>
      <div className="py-4 text-gray-900">
        {parseFloat(user.points || "0").toFixed(2)}
      </div>
      <div className="py-4">
        <Link
          href={`${url}/${user.userId}`}
          className="rounded-full bg-blue-100 p-2 px-4 text-purple-800 hover:bg-blue-300"
        >
          View
        </Link>
      </div>
    </div>
  );
};

export default async function CompetitionResults({
  params,
}: {
  params: { id: string };
}) {
  const session = await getSession();
  if (!session) {
    redirect("/login");
  }
  const data = await db.query.competitions.findFirst({
    where: (competitions, { eq }) =>
      eq(competitions.id, decodeURIComponent(params.id)),
    with: {
      site: {
        columns: {
          subdomain: true,
        },
      },
    },
  });
  if (
    !data ||
    (data.userId !== session.user.id && data.admin != session.user.email)
  ) {
    notFound();
  }

  if (new Date(data.date).getTime() >= Date.now()) {
    return <div className="my-12">Competition has not ended yet</div>;
  }

  const url = process.env.NEXT_PUBLIC_VERCEL_ENV
    ? `https://${data.site?.subdomain}.${process.env.NEXT_PUBLIC_ROOT_DOMAIN}/comp/${data.slug}`
    : `http://${data.site?.subdomain}.localhost:3000/comp/${data.slug}`;

  const winnerData = await getCompetitionWinnerData(data.id);

  return (
    <div className="flex max-w-screen-xl flex-col space-y-12 p-6">
      <div className="flex flex-col space-y-6">
        <h1 className="font-cal text-3xl font-bold dark:text-white">
          Competition Results
        </h1>
        <div className="font-bold">1st Reward Winners</div>
        {winnerData.sortedUsers
          .slice(0, winnerData.rewardWinners)
          .map((user, index) => (
            <User key={user.userId} user={user} index={index} url={url} />
          ))}

        <div className="font-bold">2nd Reward Winners</div>
        {winnerData.sortedUsers
          .slice(
            winnerData.rewardWinners,
            winnerData.rewardWinners + winnerData.reward2Winners,
          )
          .map((user, index) => (
            <User key={user.userId} user={user} index={index} url={url} />
          ))}

        <div className="font-bold">3rd Reward Winners</div>
        {winnerData.sortedUsers
          .slice(
            winnerData.rewardWinners + winnerData.reward2Winners,
            winnerData.rewardWinners +
              winnerData.reward2Winners +
              winnerData.reward3Winners,
          )
          .map((user, index) => (
            <User key={user.userId} user={user} index={index} url={url} />
          ))}
      </div>
    </div>
  );
}
