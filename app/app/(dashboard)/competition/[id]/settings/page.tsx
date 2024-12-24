import { notFound, redirect } from "next/navigation";
import Form from "@/components/form";
import { updateCompetitionMetadata } from "@/lib/actions";
import DeleteCompetitionForm from "@/components/form/deleteCompetitionForm";
import db from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export default async function CompetitionSettings({
  params,
}: {
  params: { id: string };
}) {
  const session = await getServerSession(authOptions);
  if (!session) {
    redirect("/login");
    console.log("HERE");
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
    <div className="flex  flex-col space-y-12">
      <div className="flex flex-col space-y-6">
        <h1 className="text-3xl font-bold">Competition Settings</h1>
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
          description="The thumbnail image for your competition."
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
            defaultValue: new Date(data?.date!).toISOString().split("T")[0],
            placeholder: "Date",
          }}
          handleSubmit={updateCompetitionMetadata}
        />

        <Form
          title="Competition Guidelines"
          description="The guidelines for the competition."
          helpText="Please enter the specific guidelines for the competition."
          inputAttrs={{
            name: "rules",
            type: "generalfile",
            defaultValue: data?.rules!,
          }}
          handleSubmit={updateCompetitionMetadata}
        />

        <Form
          title="Additional User Consent (Optional)"
          description="Additional user consent for the competition."
          helpText="Please enter any additional user consent for the competition."
          inputAttrs={{
            name: "consent",
            type: "text",
            defaultValue: data?.consent!,
          }}
          handleSubmit={updateCompetitionMetadata}
        />

        <DeleteCompetitionForm competitionName={data?.title!} />
      </div>
    </div>
  );
}
