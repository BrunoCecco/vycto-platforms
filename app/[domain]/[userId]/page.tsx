import { notFound } from "next/navigation";
import {
  getSiteData,
  getUserCompetitions,
  getUserDataById,
} from "@/lib/fetchers";
import UserCompListing from "@/components/competitions/userCompListing";

export default async function UserCompetitionsPage({
  params,
}: {
  params: { domain: string; userId: string };
}) {
  const domain = decodeURIComponent(params.domain);
  const userId = decodeURIComponent(params.userId);

  const siteData = await getSiteData(domain);
  if (!siteData) {
    notFound();
  }
  const user = await getUserDataById(userId);
  const competitions = await getUserCompetitions(userId, siteData.id);

  if (!competitions) {
    notFound();
  }

  return (
    <div className="overflow-scroll">
      <h1 className="mb-4 text-lg font-bold">
        {user?.username || user?.name || "User " + user?.id.substring(0, 5)}{" "}
        competitions
      </h1>
      <table className="w-full overflow-hidden rounded-lg">
        <thead>
          <tr className="">
            <th className="p-4 text-left">Competition</th>
            <th className="p-4 text-left">Result</th>
            <th className="p-4 text-left">Reward</th>
            <th className="p-4 text-right">Submission</th>
          </tr>
        </thead>
        <tbody>
          {competitions &&
            competitions.map((userComp, index) => (
              <UserCompListing
                key={index + "-usercomp"}
                userComp={userComp.userComp}
              />
            ))}
        </tbody>
      </table>
    </div>
  );
}
