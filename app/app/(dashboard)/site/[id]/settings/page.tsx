import Form from "@/components/form";
import { createSiteAdmin, deleteSiteAdmin, updateSite } from "@/lib/actions";
import DeleteSiteForm from "@/components/form/deleteSiteForm";
import db from "@/lib/db";
import { getSiteAdmins, getSiteDataById } from "@/lib/fetchers";
import { Button } from "@nextui-org/react";
import { notFound } from "next/navigation";
import DeleteAdminButton from "./deleteAdminButton";

export default async function SiteSettingsIndex({
  params,
}: {
  params: { id: string };
}) {
  const siteAdmins = await getSiteAdmins(decodeURIComponent(params.id));
  console.log(siteAdmins, "siteAdmins");
  const siteData = await getSiteDataById(decodeURIComponent(params.id));
  if (!siteData) {
    notFound();
  }
  return (
    <div className="flex flex-col space-y-6">
      <h1 className="text-3xl font-bold">Site Admins</h1>
      {siteAdmins.map((admin) => (
        <div
          key={admin.email}
          className="flex items-center space-x-2 bg-content1"
        >
          <div>{admin.email}</div>
          <DeleteAdminButton email={admin.email} siteId={siteData.id} />
        </div>
      ))}
      <Form
        title="Website Admin"
        description="The admin from the sponsor - they will be given access to edit the site."
        helpText="Please make sure the email is correct."
        inputAttrs={{
          name: "admin",
          type: "text",
          defaultValue: "",
          placeholder: "johndoe@gmail.com",
        }}
        handleSubmit={createSiteAdmin}
      />

      <Form
        title="Name"
        description="The name of your site. This will be used as the meta title on Google as well."
        helpText="Please use 32 characters maximum."
        inputAttrs={{
          name: "name",
          type: "text",
          defaultValue: siteData?.name!,
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
          defaultValue: siteData?.terms!,
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
          defaultValue: siteData?.privacypolicy!,
          placeholder: "privacypolicy",
        }}
        handleSubmit={updateSite}
      />

      <DeleteSiteForm siteName={siteData?.name!} />
    </div>
  );
}
