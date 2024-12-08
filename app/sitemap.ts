import { headers } from "next/headers";
import { getCompetitionsForSite } from "@/lib/fetchers";

export default async function Sitemap() {
  const headersList = headers();
  const domain =
    headersList
      .get("host")
      ?.replace(".localhost:3000", `.${process.env.NEXT_PUBLIC_ROOT_DOMAIN}`) ||
    "vercel.pub";

  const competitions = await getCompetitionsForSite(domain);

  return [
    {
      url: `https://${domain}`,
      lastModified: new Date(),
    },
    ...competitions.map(({ competition }) => ({
      url: `https://${domain}/${competition.slug}`,
      lastModified: new Date(),
    })),
  ];
}
