import { SelectCompetition, SelectUserCompetition } from "@/lib/schema";
import RewardsListing from "./rewardListing";

export default async function RewardsList({
  userCompetitions,
}: {
  userCompetitions: SelectUserCompetition[];
}) {
  return (
    <div>
      <h2 className="mb-4 text-2xl font-bold">Your Rewards</h2>
      <div className="overflow-hidden rounded-lg bg-gray-800">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-700">
              <th className="p-4 text-left">Event</th>
              <th className="p-4 text-left">Reward</th>
              <th className="p-4 text-left">Status</th>
            </tr>
          </thead>
          <tbody>
            {userCompetitions &&
              userCompetitions.map((userComp, index) => (
                <RewardsListing
                  key={userComp.competitionId}
                  userComp={userComp}
                />
              ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
