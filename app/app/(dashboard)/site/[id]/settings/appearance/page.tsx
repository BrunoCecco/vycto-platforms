import Form from "@/components/form";
import { updateSite } from "@/lib/actions";
import db from "@/lib/db";

export default async function SiteSettingsAppearance({
  params,
}: {
  params: { id: string };
}) {
  const data = await db.query.sites.findFirst({
    where: (sites, { eq }) => eq(sites.id, decodeURIComponent(params.id)),
  });

  return (
    <div className="flex flex-col space-y-6">
      <Form
        title="Login Page Image"
        description="The login page image for your site."
        helpText="Max file size 50MB. Recommended size 1200x630."
        inputAttrs={{
          name: "loginBanner",
          type: "file",
          defaultValue: data?.loginBanner!,
        }}
        handleSubmit={updateSite}
      />
      <Form
        title="Login Page Image (Dark Mode)"
        description="The login page image for your site when in dark mode."
        helpText="Max file size 50MB. Recommended size 1200x630."
        inputAttrs={{
          name: "loginBannerDark",
          type: "file",
          defaultValue: data?.loginBannerDark!,
        }}
        handleSubmit={updateSite}
      />
      <Form
        title="Logo"
        description="The logo for your site."
        helpText="Max file size 50MB. Recommended size 400x400."
        inputAttrs={{
          name: "logo",
          type: "file",
          defaultValue: data?.logo!,
        }}
        handleSubmit={updateSite}
      />
      <Form
        title="Font"
        description="The font for the heading text your site."
        helpText="Please select a font."
        inputAttrs={{
          name: "font",
          type: "select",
          defaultValue: data?.font!,
        }}
        handleSubmit={updateSite}
      />
      <Form
        title="Theme Colour"
        description="The theme colour for your site."
        helpText="Please select a colour."
        inputAttrs={{
          name: "color1",
          type: "select",
          defaultValue: data?.color1!,
        }}
        handleSubmit={updateSite}
      />
      <Form
        title="Secondary Colour"
        description="The secondary colour for your site."
        helpText="Please select a colour."
        inputAttrs={{
          name: "color2",
          type: "select",
          defaultValue: data?.color2!,
        }}
        handleSubmit={updateSite}
      />
      <Form
        title="Tertiary Colour"
        description="The tertiary colour for your site."
        helpText="Please select a colour."
        inputAttrs={{
          name: "color3",
          type: "select",
          defaultValue: data?.color3!,
        }}
        handleSubmit={updateSite}
      />
      <Form
        title="404 Page Message"
        description="Message to be displayed on the 404 page."
        helpText="Please use 240 characters maximum."
        inputAttrs={{
          name: "message404",
          type: "text",
          defaultValue: data?.message404!,
          placeholder: "Blimey! You've found a page that doesn't exist.",
          maxLength: 240,
        }}
        handleSubmit={updateSite}
      />
    </div>
  );
}
