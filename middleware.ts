import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

export default async function middleware(req: NextRequest) {
  const url = req.nextUrl;
  let hostname = req.headers
    .get("host")!
    .replace(".localhost:3000", `.${process.env.NEXT_PUBLIC_ROOT_DOMAIN}`);

  // Special case for Vercel preview deployment URLs
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

  const session = await getToken({ req });

  // Handle admin site (app.vyctorewards.com)
  if (hostname === `app.${process.env.NEXT_PUBLIC_ROOT_DOMAIN}`) {
    // Redirect to login if no session and not already on login page
    if (!session && path != "/login") {
      return NextResponse.redirect(new URL("/login", req.url));
    }

    // Allow access for super admins
    return NextResponse.rewrite(new URL(`/app${path}`, req.url));
  }

  // Handle user-facing sites ([example].vyctorewards.com)
  if (hostname.endsWith(`.${process.env.NEXT_PUBLIC_ROOT_DOMAIN}`)) {
    console.log("HEREEE", hostname, path, session);
    if (!session && path.startsWith("/login")) {
      return NextResponse.rewrite(
        new URL(`/app${path === "/" ? "" : path}`, req.url),
      );
    }

    // Allow all requests to user-facing sites
    return NextResponse.rewrite(new URL(`/${hostname}${path}`, req.url));
  }

  // Handle root domain (vyctorewards.com)
  if (hostname === process.env.NEXT_PUBLIC_ROOT_DOMAIN) {
    // Redirect root domain to vycto.tech
    return NextResponse.redirect("https://vycto.tech");
  }

  return NextResponse.rewrite(new URL(`/${hostname}${path}`, req.url));
  // For any other hostnames, you can decide to either:
  // 1. Redirect to the root domain
  // return NextResponse.redirect(`https://${process.env.NEXT_PUBLIC_ROOT_DOMAIN}`);
  // 2. Or show a 404 page
  // return NextResponse.rewrite(new URL('/404', req.url));
}

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
