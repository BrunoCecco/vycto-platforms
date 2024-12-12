import { notFound, redirect } from "next/navigation";
import db from "@/lib/db";
import { SelectSite, SelectSiteReward } from "@/lib/schema";
import CombinedForm from "@/components/form/combined";
import { updateSiteReward } from "@/lib/actions";
import BucketStorage from "@/components/media/bucketStorage";

export default function SiteReward({
  month,
  data,
  reward,
}: {
  month: any;
  data: SelectSite;
  reward: SelectSiteReward;
}) {
  return (
    <div key={month.label} className="w-full">
      <div className="mb-2 text-lg font-bold">{month.label} Reward</div>
      <CombinedForm
        title={""}
        helpText="Edit the reward details."
        inputAttrs={[
          {
            name: "title",
            type: "text",
            defaultValue: reward.title || "",
            label: "Title",
          },
          {
            name: "sponsor",
            type: "text",
            defaultValue: reward.sponsor || "",
            label: "Sponsor",
          },
          {
            name: "description",
            type: "text",
            defaultValue: reward.description || "",
            label: "Description",
          },
          {
            name: "image",
            type: "file",
            defaultValue: reward.image || "",
            label: month.label + " Image",
          },
          {
            name: "rewardWinners",
            type: "number",
            defaultValue: reward.rewardWinners?.toString() || "1",
            label: "Number of reward winners",
          },
        ]}
        handleSubmit={updateSiteReward}
        updateId={reward.id}
      />
      <BucketStorage
        siteName={data.name || ""}
        siteId={data.id}
        entity="siteReward"
        entityData={reward}
        bucketName={data.bucketName || undefined}
        bucketId={data.bucketId || undefined}
      />
    </div>
  );
}
