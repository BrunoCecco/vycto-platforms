import { getSession } from "@/lib/auth";
import { notFound, redirect } from "next/navigation";
import Form from "@/components/form";
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
        <Form
          title="Reward Title"
          description="Title of the rewards for this competition."
          helpText="Please enter the title of the reward."
          inputAttrs={{
            name: "rewardTitle",
            type: "text",
            defaultValue: data?.rewardTitle!,
            placeholder: "Bose Headphones",
          }}
          handleSubmit={updateCompetitionMetadata}
        />

        <Form
          title="Reward Description"
          description="Describe the rewards for this competition."
          helpText="Please enter the description/value of the reward."
          inputAttrs={{
            name: "rewardDescription",
            type: "text",
            defaultValue: data?.rewardDescription!,
            placeholder: "Win a pair of Bose Headphones worth $100",
          }}
          handleSubmit={updateCompetitionMetadata}
        />

        <Form
          title="Thumbnail image"
          description="The thumbnail image for the reward. Accepted formats: .png, .jpg, .jpeg"
          helpText="Max file size 50MB. Recommended size 1200x630."
          inputAttrs={{
            name: "rewardImage",
            type: "file",
            defaultValue: data?.rewardImage!,
          }}
          handleSubmit={updateCompetitionMetadata}
        />
      </div>
    </div>
  );
}
