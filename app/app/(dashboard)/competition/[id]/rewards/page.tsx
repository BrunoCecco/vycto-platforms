import { getSession } from "@/lib/auth";
import { notFound, redirect } from "next/navigation";
import Form from "@/components/form";
import { updateRewardMetadata } from "@/lib/actions";
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
  const data = await db.query.rewards.findFirst({
    where: (rewards, { eq }) =>
      eq(rewards.competitionId, decodeURIComponent(params.id)),
  });

  console.log(data, "data");

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
            name: "reward",
            type: "text",
            defaultValue: data?.title!,
            placeholder: "Bose Headphones",
          }}
          handleSubmit={updateRewardMetadata}
        />

        <Form
          title="Reward Description"
          description="Describe the rewards for this competition."
          helpText="Please enter the description of the reward."
          inputAttrs={{
            name: "reward",
            type: "text",
            defaultValue: data?.description!,
            placeholder: "Win a pair of Bose Headphones",
          }}
          handleSubmit={updateRewardMetadata}
        />

        <Form
          title="Thumbnail image"
          description="The thumbnail image for the reward. Accepted formats: .png, .jpg, .jpeg"
          helpText="Max file size 50MB. Recommended size 1200x630."
          inputAttrs={{
            name: "image",
            type: "file",
            defaultValue: data?.image!,
          }}
          handleSubmit={updateRewardMetadata}
        />

        <Form
          title="Reward Value"
          description="The monetary value of the reward."
          helpText="Please enter the value of the reward."
          inputAttrs={{
            name: "value",
            type: "text",
            defaultValue: data?.value!,
            placeholder: "$100",
          }}
          handleSubmit={updateRewardMetadata}
        />
      </div>
    </div>
  );
}
