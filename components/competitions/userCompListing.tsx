import { getCompetitionFromId } from "@/lib/fetchers";
import { SelectUserCompetition } from "@/lib/schema";
import { getSession } from "next-auth/react";
import Image from "next/image";
import Button from "../buttons/button";

export default async function UserCompListing({
  userComp,
}: {
  userComp: SelectUserCompetition;
}) {
  const session = await getSession();

  const comp = await getCompetitionFromId(userComp.competitionId);
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

  if (!userReward)
    return (
      <tr className="bg-gray-800">
        <td className="p-4 text-left">
          <div className="flex items-center">
            <div className="relative h-10 w-10">
              <Image
                className="h-full w-full rounded-full"
                src={comp?.image || "/placeholder.png"}
                alt=""
                fill
              />
            </div>
            <div className="ml-4">
              <div className="text-sm font-medium text-gray-300">
                {comp?.title || "Unknown competition"}
              </div>
            </div>
          </div>
        </td>
        <td className="p-4 text-left text-sm font-medium text-gray-300">
          <div className="text-sm font-medium text-gray-300">
            Points: {userComp.points}
          </div>
          <div className="text-sm font-medium text-gray-300">
            Rank: {userComp.ranking}/{userComp.totalUsers}
          </div>
          <div className="text-sm font-medium text-gray-300">
            Average: {userComp.averagePoints}
          </div>
        </td>
        <td className="p-4 text-left">
          <div className="text-sm text-gray-300">{comp?.rewardTitle}</div>
        </td>
      </tr>
    );

  // return a beautiful table row containing info about the reward that the user has won, if any
  return (
    <tr className="bg-gray-800">
      <td className="p-4 text-left">
        <div className="flex items-center">
          <div className="relative h-10 w-10">
            <Image
              className="h-full w-full rounded-full"
              src={userReward.image || "/placeholder.png"}
              alt=""
              fill
            />
          </div>
          <div className="ml-4">
            <div className="text-sm font-medium text-gray-300">
              {comp?.title}
            </div>
          </div>
        </div>
      </td>
      <td className="p-4 text-left">
        <div className="text-sm font-medium text-gray-300">
          Points: {userComp.points}
        </div>
        <div className="text-sm font-medium text-gray-300">
          Rank: {userComp.ranking}/{userComp.totalUsers}
        </div>
        <div className="text-sm font-medium text-gray-300">
          Average: {userComp.averagePoints}
        </div>
      </td>
      <td className="p-4 text-left">
        <div className="text-sm text-gray-300">{userReward.title}</div>
        <div className="text-sm text-gray-300">{userReward.description}</div>
        {canClaim && (
          <Button className="bg-gradient-to-tr from-blue-200 to-blue-400">
            Claim
          </Button>
        )}
      </td>
    </tr>
  );
}
