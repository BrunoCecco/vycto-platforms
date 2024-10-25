import {
  getCompetitionFromId,
  getSiteData,
  getSiteDataById,
} from "@/lib/fetchers";
import { SelectUserCompetition } from "@/lib/schema";
import Image from "next/image";
import Button from "../buttons/button";
import Link from "next/link";
import { getSiteFromCompetitionId } from "@/lib/actions";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export default async function UserCompListing({
  userComp,
}: {
  userComp: SelectUserCompetition;
}) {
  const session = await getServerSession(authOptions);

  const comp = await getCompetitionFromId(userComp.competitionId);
  const siteData = await getSiteDataById(comp?.siteId || "");

  const rewardDetails = () => {
    if (comp?.id.startsWith("yt")) console.log("rewardid:", userComp.rewardId);
    switch (userComp.rewardId) {
      case 0:
        return {
          title: comp?.rewardTitle,
          description: comp?.rewardDescription,
          image: comp?.rewardImage,
        };
      case 1:
        return {
          title: comp?.reward2Title,
          description: comp?.reward2Description,
          image: comp?.reward2Image,
        };
      case 2:
        return {
          title: comp?.reward3Title,
          description: comp?.reward3Description,
          image: comp?.reward3Image,
        };
      default:
        return null;
    }
  };

  const userReward = rewardDetails();
  const canClaim = session?.user.id === userComp.userId && userReward != null;

  const url = process.env.NEXT_PUBLIC_VERCEL_ENV
    ? `https://${siteData?.subdomain}.${process.env.NEXT_PUBLIC_ROOT_DOMAIN}/comp/${comp?.slug}/${userComp.userId}`
    : `http://${siteData?.subdomain}.localhost:3000/comp/${comp?.slug}/${userComp.userId}`;

  // return a beautiful table row containing info about the reward that the user has won, if any
  return (
    <tr className="bg-gray-800">
      <td className="p-4 text-left">
        <div className="flex items-center">
          <div className="relative h-10 w-10 flex-shrink-0">
            <Image
              className="rounded-full object-cover"
              src={
                (userReward ? userReward.image : comp?.image) ||
                "/placeholder.png"
              }
              alt=""
              fill
            />
          </div>
          <div className="ml-4">
            <div className="text-sm font-medium text-gray-300">
              {siteData?.name}
            </div>
            <div className="text-sm font-medium text-gray-300">
              {comp?.title}
            </div>
          </div>
        </div>
      </td>
      <td className="p-4 text-left">
        <div className="text-sm font-medium text-gray-300">
          {userComp.points}
        </div>
      </td>
      <td className="gap-1 p-4 text-center">
        <div className="text-sm text-gray-300">
          <div className="text-sm font-medium text-gray-300">
            # {userComp.ranking}
          </div>
          {userReward?.title || comp?.rewardTitle}
        </div>
        <div className="text-sm text-gray-300">{userReward?.description}</div>
        {canClaim && (
          <div className="mt-2 flex items-center justify-center">
            <Button className="bg-gradient-to-tr from-blue-200 to-blue-400">
              Claim
            </Button>
          </div>
        )}
      </td>
      <td className="p-4 text-right">
        <Link
          href={url}
          className="w-min rounded-lg bg-blue-100 p-2 px-4 text-sm text-purple-800 shadow-md transition-all duration-200 hover:bg-blue-300 hover:shadow-none"
          rel="noreferrer"
          target="_blank"
        >
          View
        </Link>
      </td>
    </tr>
  );
}
