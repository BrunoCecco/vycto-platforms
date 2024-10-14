import { getCompetitionFromId } from "@/lib/fetchers";
import { SelectUserCompetition } from "@/lib/schema";
import Image from "next/image";

export default async function UserCompetitionInfo({
  userComp,
}: {
  userComp: SelectUserCompetition;
}) {
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
  if (comp?.id.startsWith("yt")) console.log(userReward, "reward");
  if (!userReward)
    return (
      <div className="bg-gray-800">
        <div className="p-4 text-left">
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
        </div>
        <div className="p-4 text-left">No reward</div>
        <div className="p-4 text-left">
          <div className="text-sm text-gray-300"></div>
        </div>
      </div>
    );

  // return a beautiful table row containing info about the reward that the user has won, if any
  return (
    <div className="bg-gray-800">
      <div className="p-4 text-left">
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
            <div className="text-sm text-gray-300">
              Rank: {userComp.ranking}
            </div>
            <div className="text-sm text-gray-300">
              {parseFloat(userComp.points || "0").toFixed(2)} Pts
            </div>
          </div>
        </div>
      </div>
      <div className="p-4 text-left">
        <div className="font-medium">{userReward.title}</div>
        <div className="text-sm text-gray-300">{userReward.description}</div>
      </div>
      <div className="p-4 text-left">
        <div className="text-sm text-gray-300">Claim soon...</div>
      </div>
    </div>
  );
}
