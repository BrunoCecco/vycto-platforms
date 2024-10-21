import UserSignUp from "@/components/auth/userSignUp";
import { getSiteData } from "@/lib/fetchers";
import { headers } from "next/headers";
import B2BSignUp from "@/components/auth/b2BSignUp";
import ViewUnavailable from "@/components/mobile/viewUnavailable";
import SignUpWrapper from "@/components/auth/signUpWrapper";
import { BackgroundGradientAnimation } from "@/components/ui/backgroundGradientAnimation";

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
    <div className="">
      <B2BSignUp />
    </div>
  ) : (
    <SignUpWrapper siteData={siteData}>
      <UserSignUp siteData={siteData} />
    </SignUpWrapper>
  );
}
