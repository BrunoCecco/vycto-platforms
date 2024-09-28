import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import { users } from "./lib/schema";
import db from "./lib/db";
import { eq } from "drizzle-orm";
import { updateName, updateUsername } from "./lib/actions";

const SUPER_ADMINS = [
  "bruno.ceccolini@gmail.com",
  "nicolas@vycto.com",
  "nicolasconstantinou9@gmail.com",
  "nicolas@vycto.ai",
  "nicolas2ric@gmail.com",
];

export const config = {
  matcher: [
    /*
     * Match all paths except for:
     * 1. /api routes
     * 2. /_next (Next.js internals)
     * 3. /_static (inside /public)
     * 4. all root files inside /public (e.g. /favicon.ico)
     */
    "/((?!api/|_next/|_static/|_vercel|[\\w-]+\\.\\w+).*)",
  ],
};

export default async function middleware(req: NextRequest) {
  const url = req.nextUrl;

  // Get hostname of request (e.g. demo.vercel.pub, demo.localhost:3000)
  let hostname = req.headers
    .get("host")!
    .replace(".localhost:3000", `.${process.env.NEXT_PUBLIC_ROOT_DOMAIN}`);

  // special case for Vercel preview deployment URLs
  if (
    hostname.includes("---") &&
    hostname.endsWith(`.${process.env.NEXT_PUBLIC_VERCEL_DEPLOYMENT_SUFFIX}`)
  ) {
    hostname = `${hostname.split("---")[0]}.${
      process.env.NEXT_PUBLIC_ROOT_DOMAIN
    }`;
  }

  const searchParams = req.nextUrl.searchParams.toString();
  // Get the pathname of the request (e.g. /, /about, /blog/first-competition)
  const path = `${url.pathname}${
    searchParams.length > 0 ? `?${searchParams}` : ""
  }`;
  // rewrites for app pages
  if (
    hostname.includes(`${process.env.NEXT_PUBLIC_ROOT_DOMAIN}`) &&
    hostname != process.env.NEXT_PUBLIC_ROOT_DOMAIN
  ) {
    const session = await getToken({ req });
    if (!session && path.includes("/comp")) {
      console.log("redirecting to comp" + hostname + path);
      return NextResponse.rewrite(new URL(`/${hostname}${path}`, req.url));
    } else if (
      !session &&
      path !== "/login" &&
      path !== "/verify" &&
      !path.includes("/comp")
    ) {
      console.log("redirecting to login");
      return NextResponse.redirect(new URL("/login", req.url));
    } else if (session && (path === "/login" || path === "/verify")) {
      return NextResponse.redirect(new URL("/", req.url));
    } else if (
      session &&
      hostname != `app.${process.env.NEXT_PUBLIC_ROOT_DOMAIN}`
    ) {
      return NextResponse.rewrite(new URL(`/${hostname}${path}`, req.url));
    }
    if (session && SUPER_ADMINS.indexOf(session?.email || "") != -1) {
      return NextResponse.rewrite(
        new URL(`/app${path === "/" ? "" : path}`, req.url),
      );
    } else if (session && SUPER_ADMINS.indexOf(session?.email || "") == -1) {
      return NextResponse.rewrite(
        new URL(`/home${path === "/" ? "" : path}`, req.url),
      );
    }
    return NextResponse.rewrite(
      new URL(`/app${path === "/" ? "" : path}`, req.url),
    );
  }

  // special case for `vercel.pub` domain
  if (hostname === "vercel.pub") {
    return NextResponse.redirect(
      "https://vercel.com/blog/platforms-starter-kit",
    );
  }

  // rewrite root application to `/home` folder
  if (
    hostname === "localhost:3000" ||
    hostname === process.env.NEXT_PUBLIC_ROOT_DOMAIN
  ) {
    return NextResponse.redirect("https://vycto.tech");
    // return NextResponse.rewrite(
    //   new URL(`/home${path === "/" ? "" : path}`, req.url),
    // );
  }

  // rewrite everything else to `/[domain]/[slug] dynamic route
  return NextResponse.rewrite(new URL(`/${hostname}${path}`, req.url));
}
