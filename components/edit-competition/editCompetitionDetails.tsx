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
          title=""
          description=""
          helpText=""
          inputAttrs={{
            name: "image",
            type: "file",
            defaultValue: data?.image!,
          }}
          handleSubmit={updateCompetitionMetadata}
        >
          <div className="flex flex-col">
            <h1 className="mb-4 text-left text-xl font-bold ">
              Competition Thumbnail
            </h1>
            <div className="relative flex  h-[200px] w-[300px] cursor-pointer flex-col items-center justify-center overflow-hidden rounded-xl md:h-[300px] md:w-[450px] lg:h-[400px] lg:w-[600px]">
              {data.image ? (
                <BlurImage
                  src={data.image || "/placeholder.png"}
                  blurDataURL={data.imageBlurhash || placeholderBlurhash}
                  width={1200}
                  height={630}
                  alt="Thumbnail Image"
                  className="h-full w-full rounded-lg object-cover"
                />
              ) : null}
              <div className="absolute flex h-full w-full cursor-pointer items-center justify-center rounded-lg border-white  opacity-25">
                <Plus className="h-10 w-10 " />
              </div>
            </div>
          </div>
        </Form>
      </div>

      {/* Text section */}
      <div className="mb-8 w-full text-stone-800">
        <EditCompetitionTitle competition={competitionData!} />
        <CombinedForm
          title="Competition Details"
          descriptions={["Competition Sponsor", "Date"]}
          helpText=""
          inputAttrs={[
            {
              name: "sponsor",
              type: "text",
              defaultValue: data?.sponsor!,
              placeholder: "sponsor",
            },
            {
              name: "date",
              type: "date",
              defaultValue: new Date(data?.date!).toISOString().split("T")[0],
              placeholder: "Date",
            },
          ]}
          handleSubmit={updateCompetitionMetadata}
        />
      </div>
    </div>
  );
};

export default EditCompetitionDetails;
