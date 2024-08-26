import { getSession } from "@/lib/auth";
import { notFound, redirect } from "next/navigation";
import CombinedForm from "@/components/form/combined";
import { updateCompetitionMetadata } from "@/lib/actions";
import db from "@/lib/db";

export default async function CompetitionRewards({
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
  });
  if (
    !data ||
    (data.userId !== session.user.id && data.admin != session.user.email)
  ) {
    notFound();
  }
  return (
    <div className="flex max-w-screen-xl flex-col space-y-12 p-6">
      <div className="flex flex-col space-y-6">
        <h1 className="font-cal text-3xl font-bold dark:text-white">
          Competition Rewards
        </h1>
        <CombinedForm
          title="Reward #1"
          descriptions={[
            "Title of the main reward for this competition.",
            "Describe the main reward for this competition.",
            "The thumbnail image for the main reward. Accepted formats: .png, .jpg, .jpeg",
          ]}
          helpText="Please enter the details for the main reward."
          inputAttrs={[
            {
              name: "rewardTitle",
              type: "text",
              defaultValue: data?.rewardTitle!,
              placeholder: "Season Ticket",
            },
            {
              name: "rewardDescription",
              type: "text",
              defaultValue: data?.rewardDescription!,
              placeholder: "Win a season ticket worth $2000",
            },
            {
              name: "rewardImage",
              type: "file",
              defaultValue: data?.rewardImage!,
            },
          ]}
          handleSubmit={updateCompetitionMetadata}
        />
        <CombinedForm
          title="Reward #2"
          descriptions={[
            "Title of the secondary rewards for this competition.",
            "Describe the secondary rewards for this competition.",
            "The thumbnail image for the secondary reward. Accepted formats: .png, .jpg, .jpeg",
          ]}
          helpText="Please enter the details for the secondary reward."
          inputAttrs={[
            {
              name: "reward2Title",
              type: "text",
              defaultValue: data?.reward2Title!,
              placeholder: "%15 off all games",
            },
            {
              name: "reward2Description",
              type: "text",
              defaultValue: data?.reward2Description!,
              placeholder: "Win a %15 discount on all games",
            },
            {
              name: "reward2Image",
              type: "file",
              defaultValue: data?.reward2Image!,
            },
          ]}
          handleSubmit={updateCompetitionMetadata}
        />
      </div>
    </div>
  );
}
