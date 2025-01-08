import { notFound, redirect } from "next/navigation";
import CombinedForm from "@/components/form/combined";
import { updateCompetitionMetadata } from "@/lib/actions";
import db from "@/lib/db";
import Form from "@/components/form";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getCompetitionDataWithSite, getSiteAdmins } from "@/lib/fetchers";

export default async function CompetitionRewards({
  params,
}: {
  params: { id: string };
}) {
  const session = await getServerSession(authOptions);
  if (!session) {
    redirect("/login");
  }
  const data = await getCompetitionDataWithSite(decodeURIComponent(params.id));

  if (!data?.site) {
    notFound();
  }

  const siteAdmins = await getSiteAdmins(data?.site.id);

  if (
    !data ||
    (data.userId !== session.user.id &&
      !siteAdmins.find((admin) => admin.email === session.user.email))
  ) {
    notFound();
  }
  return (
    <div className="flex flex-col space-y-12">
      <div className="flex flex-col space-y-6">
        <h1 className="text-3xl font-bold ">Competition Rewards</h1>
        <CombinedForm
          title="Reward #1"
          helpText="Please enter the details for the main reward."
          inputAttrs={[
            {
              name: "rewardTitle",
              type: "text",
              defaultValue: data?.rewardTitle!,
              placeholder: "Title",
              label: "Title of the main reward for this competition.",
            },
            {
              name: "rewardDescription",
              type: "text",
              defaultValue: data?.rewardDescription!,
              placeholder: "Description",
              label: "Description",
            },
            {
              name: "rewardWinners",
              type: "number",
              min: "0",
              defaultValue: data?.rewardWinners?.toString() || "1",
              label: "Number of winners for the main reward.",
            },
            {
              name: "rewardImage",
              type: "file",
              defaultValue: data?.rewardImage!,
              label: "The thumbnail image for the main reward.",
            },
          ]}
          handleSubmit={updateCompetitionMetadata}
        />

        <CombinedForm
          title="Reward #2"
          helpText="Please enter the details for the secondary reward."
          inputAttrs={[
            {
              name: "reward2Title",
              type: "text",
              defaultValue: data?.reward2Title!,
              placeholder: "Title secondary",
              label: "Title of the secondary reward for this competition.",
            },
            {
              name: "reward2Description",
              type: "text",
              defaultValue: data?.reward2Description!,
              placeholder: "Description secondary",
              label: "Description",
            },
            {
              name: "reward2Winners",
              type: "number",
              min: "0",
              defaultValue: data?.reward2Winners?.toString() || "1",
              label: "Number of winners for the secondary reward.",
            },
            {
              name: "reward2Image",
              type: "file",
              defaultValue: data?.reward2Image!,
              label: "The thumbnail image for the secondary reward.",
            },
          ]}
          handleSubmit={updateCompetitionMetadata}
        />

        {/* <Form
          title="Secondary Reward Image"
          description="The thumbnail image for the secondary reward."
          helpText="Please enter the image for the secondary reward."
          inputAttrs={{
            name: "reward2Image",
            type: "file",
            defaultValue: data?.reward2Image!,
          }}
          handleSubmit={updateCompetitionMetadata}
        /> */}
      </div>
    </div>
  );
}
