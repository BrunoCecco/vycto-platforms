import Form from "@/components/form";
import { createSiteAdmin, deleteSiteAdmin, updateSite } from "@/lib/actions";
import DeleteSiteForm from "@/components/form/deleteSiteForm";
import db from "@/lib/db";
import { getSiteAdmins, getSiteDataById } from "@/lib/fetchers";
import { Button, Input } from "@nextui-org/react";
import { notFound } from "next/navigation";
import DeleteAdminButton from "./deleteAdminButton";
import CreateAdminForm from "./createAdminForm";

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
      <div className="flex flex-col gap-2 rounded-lg border p-4 md:p-10">
        <h1 className="text-xl">Site Admins</h1>
        {siteAdmins.map(
          (admin) =>
            admin.email != "bruno.ceccolini@gmail.com" &&
            admin.email != "nicolasconstantinou9@gmail.com" && (
              <div
                key={admin.email}
                className="flex flex-wrap items-center justify-between gap-2 rounded-lg border-b bg-content1 p-2"
              >
                <div className="px-2">{admin.email}</div>
                <DeleteAdminButton email={admin.email} siteId={siteData.id} />
              </div>
            ),
        )}
        <div className="my-4" />
        <CreateAdminForm siteId={siteData.id} />
      </div>

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
        helpText="Please upload the T&Cs for your site."
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
        helpText="Please upload the privacy policy for your site."
        inputAttrs={{
          name: "privacypolicy",
          type: "generalfile",
          defaultValue: siteData?.privacypolicy!,
          placeholder: "privacypolicy",
        }}
        handleSubmit={updateSite}
      />

      <Form
        title="Cookie Policy"
        description="The cookie policy for your site."
        helpText="Please upload the cookie policy for your site."
        inputAttrs={{
          name: "cookiepolicy",
          type: "generalfile",
          defaultValue: siteData?.cookiepolicy!,
          placeholder: "cookiepolicy",
        }}
        handleSubmit={updateSite}
      />

      <DeleteSiteForm siteName={siteData?.name!} />
    </div>
  );
}
