import { getSession } from "@/lib/auth";
import { notFound, redirect } from "next/navigation";
import Form from "@/components/form";
import { updateCompetitionMetadata } from "@/lib/actions";
import DeleteCompetitionForm from "@/components/form/delete-competition-form";
import db from "@/lib/db";

export default async function CompetitionSettings({
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
          Competition Settings
        </h1>
        <Form
          title="Competition Slug"
          description="The slug is the URL-friendly version of the name. It is usually all lowercase and contains only letters, numbers, and hyphens."
          helpText="Please use a slug that is unique to this competition."
          inputAttrs={{
            name: "slug",
            type: "text",
            defaultValue: data?.slug!,
            placeholder: "slug",
          }}
          handleSubmit={updateCompetitionMetadata}
        />

        <Form
          title="Thumbnail image"
          description="The thumbnail image for your competition. Accepted formats: .png, .jpg, .jpeg"
          helpText="Max file size 50MB. Recommended size 1200x630."
          inputAttrs={{
            name: "image",
            type: "file",
            defaultValue: data?.image!,
          }}
          handleSubmit={updateCompetitionMetadata}
        />

        <Form
          title="Competition Sponsor"
          description="The sponsor/brand for this competition."
          helpText="Please enter the name of the sponsor/brand."
          inputAttrs={{
            name: "sponsor",
            type: "text",
            defaultValue: data?.sponsor!,
            placeholder: "sponsor",
          }}
          handleSubmit={updateCompetitionMetadata}
        />

        <Form
          title="Date"
          description="The date of the competition"
          helpText="Please enter the date of the competition"
          inputAttrs={{
            name: "date",
            type: "date",
            defaultValue: data?.date!,
            placeholder: "Date",
          }}
          handleSubmit={updateCompetitionMetadata}
        />
        <DeleteCompetitionForm competitionName={data?.title!} />
      </div>
    </div>
  );
}
