import { Suspense, useState } from "react";
import { signIn } from "next-auth/react";
import LoginButton from "../../../../components/auth/loginButton";
import UserSignUp from "@/components/auth/userSignUp";
import { getSiteData } from "@/lib/fetchers";
import { headers } from "next/headers";
import B2BSignUp from "@/components/auth/b2BSignUp";

export default async function LoginPage({
  params,
}: {
  params: { domain: string };
}) {
  const domain = decodeURIComponent(params.domain);
  const heads = headers();
  const host = heads.get("x-forwarded-host");
  const siteData = await getSiteData(host || domain);

  return host?.includes("app.vycto.com") || host?.includes("app.localhost") ? (
    <B2BSignUp />
  ) : (
    <UserSignUp siteData={siteData} />
  );
}
