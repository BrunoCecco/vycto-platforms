"use client";
import { SelectCompetition, SelectUserCompetition } from "@/lib/schema";
import UserCompListing from "../competitions/userCompListing";
import { useTranslations } from "next-intl";

export default function RewardsList({
  userCompetitions,
}: {
  userCompetitions: SelectUserCompetition[];
}) {
  const t = useTranslations();
  return (
    <div>
      <h2 className="mb-4 text-2xl font-bold">{t("yourrewards")}</h2>
      <div className="overflow-scroll rounded-lg">
        <table className="w-full rounded-lg">
          <thead>
            <tr className="">
              <th className="p-4 text-left">Competition</th>
              <th className="p-4 text-left">Result</th>
              <th className="p-4 text-center">Reward</th>
              <th className="p-4 text-right">Submission</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b text-sm">
              <td className="p-4 text-left">COMING SOON...</td>
              <td className="p-4 text-left"></td>
              <td className="p-4 text-center"></td>
              <td className="p-4 text-right"></td>
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
