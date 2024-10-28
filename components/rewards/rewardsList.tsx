import { SelectCompetition, SelectUserCompetition } from "@/lib/schema";
import UserCompListing from "../competitions/userCompListing";

export default async function RewardsList({
  userCompetitions,
}: {
  userCompetitions: SelectUserCompetition[];
}) {
  return (
    <div>
      <h2 className="mb-4 text-2xl font-bold">Your Rewards</h2>
      <div className="overflow-scroll rounded-lg bg-gray-800">
        <table className="w-full rounded-lg">
          <thead>
            <tr className="bg-gray-700">
              <th className="p-4 text-left">Competition</th>
              <th className="p-4 text-left">Result</th>
              <th className="p-4 text-center">Reward</th>
              <th className="p-4 text-right">Submission</th>
            </tr>
          </thead>
          <tbody>
            <tr className="bg-gray-800 text-sm text-slate-400">
              <td className="p-4 text-left">COMING SOON...</td>
              <td className="p-4 text-left">COMING SOON...</td>
              <td className="p-4 text-center">COMING SOON...</td>
              <td className="p-4 text-right">COMING SOON...</td>
            </tr>
            {/* {userCompetitions &&
              userCompetitions.map((userComp, index) => (
                <UserCompListing
                  key={userComp.competitionId}
                  userComp={userComp}
                />
              ))} */}
          </tbody>
        </table>
      </div>
    </div>
  );
}
