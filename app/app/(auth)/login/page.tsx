import { Suspense, useState } from "react";
import { signIn } from "next-auth/react";
import LoginButton from "./loginButton";
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
  //   <input
  //     type="email"
  //     id="email"
  //     name="email"
  //     placeholder="Email address"
  //     onChange={(e) => setEmail(e.target.value)}
  //     className="mt-1 block w-full rounded-md border border-stone-200 dark:border-stone-400"
  //   />
  //   <input
  //     type="text"
  //     id="username"
  //     name="username"
  //     placeholder="Username"
  //     onChange={(e) => setUsername(e.target.value)}
  //     className="mt-1 block w-full rounded-md border border-stone-200 dark:border-stone-400"
  //   />

  //   <Suspense
  //     fallback={
  //       <div className="my-2 h-10 w-full rounded-md border border-stone-200 bg-stone-100 dark:border-stone-700 dark:bg-stone-800" />
  //     }
  //   >
  // <LoginButton email={email} username={username} />
  //   </Suspense>
  // </div>
}
