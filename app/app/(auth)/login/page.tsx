import UserSignUp from "@/components/auth/userSignUp";
import { getSiteData } from "@/lib/fetchers";
import { headers } from "next/headers";
import B2BSignUp from "@/components/auth/b2BSignUp";
import ViewUnavailable from "@/components/mobile/viewUnavailable";

export default async function LoginPage() {
  const heads = headers();
  const host = heads
    .get("x-forwarded-host")
    ?.replace(".localhost:3000", `.${process.env.NEXT_PUBLIC_ROOT_DOMAIN}`);

  const host1 = heads
    .get("host")
    ?.replace(".localhost:3000", `.${process.env.NEXT_PUBLIC_ROOT_DOMAIN}`);
  console.log(host, host1);
  const siteData = host ? await getSiteData(host) : undefined;

  return host?.includes("app.") ? (
    <div>
      {/* Show B2BSignUp on screens larger than 'sm' */}
      <div className="hidden sm:block">
        <B2BSignUp />
      </div>
      {/* Show ViewUnavailable on screens smaller than 'sm' */}
      <div className="block sm:hidden">
        <ViewUnavailable />
      </div>
    </div>
  ) : (
    <div className="mx-auto flex max-w-lg flex-col items-center justify-center p-8">
      <UserSignUp siteData={siteData} />
    </div>
  );
}
