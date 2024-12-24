import Form from "@/components/form";
import { updateSite } from "@/lib/actions";
import DeleteSiteForm from "@/components/form/deleteSiteForm";
import db from "@/lib/db";
import { getSiteDataById } from "@/lib/fetchers";

export default async function SiteSettingsIndex({
  params,
}: {
  params: { id: string };
}) {
  const data = await getSiteDataById(decodeURIComponent(params.id));
  return (
    <div className="flex flex-col space-y-6">
      <Form
        title="Sponsor Admin"
        description="The admin from the sponsor - they will be given access to edit the site."
        helpText="Please make sure the email is correct."
        inputAttrs={{
          name: "admin",
          type: "text",
          defaultValue: data?.admin!,
          placeholder: "johndoe@gmail.com",
        }}
        handleSubmit={updateSite}
      />

      <Form
        title="Name"
        description="The name of your site. This will be used as the meta title on Google as well."
        helpText="Please use 32 characters maximum."
        inputAttrs={{
          name: "name",
          type: "text",
          defaultValue: data?.name!,
          placeholder: "My Awesome Site",
          maxLength: 32,
        }}
        handleSubmit={updateSite}
      />
      {/* 
      <Form
        title="Description"
        description="The description of your site. This will be used as the meta description on Google as well."
        helpText="Include SEO-optimized keywords that you want to rank for."
        inputAttrs={{
          name: "description",
          type: "text",
          defaultValue: data?.description!,
          placeholder: "A blog about really interesting things.",
        }}
        handleSubmit={updateSite}
      /> */}

      <Form
        title="Terms & Conditions"
        description="The terms and conditions for your site."
        helpText="Please enter the T&Cs for your site."
        inputAttrs={{
          name: "terms",
          type: "generalfile",
          defaultValue: data?.terms!,
          placeholder: "terms",
        }}
        handleSubmit={updateSite}
      />

      <Form
        title="Privacy Policy"
        description="The privacy policy for your site."
        helpText="Please enter the privacy policy for your site."
        inputAttrs={{
          name: "privacypolicy",
          type: "generalfile",
          defaultValue: data?.privacypolicy!,
          placeholder: "privacypolicy",
        }}
        handleSubmit={updateSite}
      />

      <DeleteSiteForm siteName={data?.name!} />
    </div>
  );
}
