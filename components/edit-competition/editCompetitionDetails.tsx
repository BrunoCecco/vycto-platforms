import { SelectCompetition, SelectSite } from "@/lib/schema";
import { placeholderBlurhash } from "@/lib/utils";
import { DateTime } from "luxon";
import BlurImage from "@/components/media/blurImage";
import Form from "../form";
import { updateCompetition, updateCompetitionMetadata } from "@/lib/actions";
import { Plus } from "lucide-react";
import db from "@/lib/db";
import CombinedForm from "../form/combined";
import PublishCompetitionButtons from "@/components/edit-competition/publishCompetitionButtons";
import EditCompetitionTitle from "./editCompetitionTitle";

const EditCompetitionDetails = async ({
  data,
}: {
  data: SelectCompetition & { site: any };
}) => {
  const competitionData = await db.query.competitions.findFirst({
    where: (competitions, { eq }) =>
      eq(competitions.id, decodeURIComponent(data.id)),
    with: {
      site: true,
    },
  });

  return (
    <div className="mx-auto flex w-full flex-col items-center justify-center md:rounded-3xl">
      {/* Placeholder for Image or Graphic */}
      <PublishCompetitionButtons competition={competitionData!} />
      <div className="my-4 w-full overflow-hidden rounded-xl">
        <Form
          title="Thumbnail Image"
          description=""
          helpText=""
          inputAttrs={{
            name: "image",
            type: "file",
            defaultValue: data?.image!,
            placeholder: "Thumbnail Image",
            label: "Thumbnail Image"
          }}
          handleSubmit={updateCompetitionMetadata}
        />
      </div>

      {/* Text section */}
      <div className="mb-8 w-full ">
        <EditCompetitionTitle competition={competitionData!} />
        <CombinedForm
          title="Competition Details"
          helpText=""
          inputAttrs={[
            {
              name: "sponsor",
              type: "text",
              defaultValue: data?.sponsor!,
              placeholder: "sponsor",
              label: "Competition Sponsor",
            },
            {
              name: "date",
              type: "date",
              defaultValue: new Date(data?.date!).toISOString().split("T")[0],
              placeholder: "Date",
              label: "Competition Date",
            },
          ]}
          handleSubmit={updateCompetitionMetadata}
        />
      </div>
    </div>
  );
};

export default EditCompetitionDetails;
