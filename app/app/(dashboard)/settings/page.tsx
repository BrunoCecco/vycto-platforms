import UserSettings from "@/components/settings/userSettings";
import { getSiteData } from "@/lib/fetchers";

export default async function SettingsPage({
  params,
}: {
  params: { domain: string };
}) {
  const domain = decodeURIComponent(params.domain);
  const data = await getSiteData(domain);

  return <UserSettings siteData={data} />;
}
