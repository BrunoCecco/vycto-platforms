import { authOptions } from "@/lib/auth";
import { getSiteData } from "@/lib/fetchers";
import { getServerSession } from "next-auth";
import { getRequestConfig, setRequestLocale } from "next-intl/server";
import { headers } from "next/headers";

export default getRequestConfig(async () => {
  // Provide a static locale, fetch a user setting,
  // read from `cookies()`, `headers()`, etc.

  // how do i fetch the domain from the request? a: from the headers
  // get the domain from the headers
  const domain = headers()
    .get("host")!
    .replace(".localhost:3000", `.${process.env.NEXT_PUBLIC_ROOT_DOMAIN}`);
  const siteData = await getSiteData(domain);
  const session = await getServerSession(authOptions);
  const userLocale = session?.user?.locale;
  const locale = userLocale || siteData?.locale || "en";

  setRequestLocale(locale);
  console.log("userLocale", locale);

  return {
    locale,
    messages: (await import(`../messages/${locale}.json`)).default,
  };
});
