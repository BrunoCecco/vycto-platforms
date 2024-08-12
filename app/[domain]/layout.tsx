import Image from "next/image";
import Link from "next/link";
import { ReactNode } from "react";
import CTA from "@/components/old-components/cta";
import ReportAbuse from "@/components/old-components/report-abuse";
import { notFound, redirect } from "next/navigation";
import { getSiteData } from "@/lib/fetchers";
import { fontMapper } from "@/styles/fonts";
import { Metadata } from "next";

export async function generateMetadata({
  params,
}: {
  params: { domain: string };
}): Promise<Metadata | null> {
  const domain = decodeURIComponent(params.domain);
  const data = await getSiteData(domain);
  if (!data) {
    return null;
  }
  const {
    name: title,
    description,
    image,
    logo,
  } = data as {
    name: string;
    description: string;
    image: string;
    logo: string;
  };

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: [image],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [image],
      creator: "@vercel",
    },
    icons: [logo],
    metadataBase: new URL(`https://${domain}`),
    // Optional: Set canonical URL to custom domain if it exists
    // ...(params.domain.endsWith(`.${process.env.NEXT_PUBLIC_ROOT_DOMAIN}`) &&
    //   data.customDomain && {
    //     alternates: {
    //       canonical: `https://${data.customDomain}`,
    //     },
    //   }),
  };
}

export default async function SiteLayout({
  params,
  children,
}: {
  params: { domain: string };
  children: ReactNode;
}) {
  const domain = decodeURIComponent(params.domain);
  const data = await getSiteData(domain);

  if (!data) {
    notFound();
  }

  // Optional: Redirect to custom domain if it exists
  if (
    domain.endsWith(`.${process.env.NEXT_PUBLIC_ROOT_DOMAIN}`) &&
    data.customDomain &&
    process.env.REDIRECT_TO_CUSTOM_DOMAIN_IF_EXISTS === "true"
  ) {
    return redirect(`https://${data.customDomain}`);
  }

  return (
    <div
      className={fontMapper[data.font]}
      style={{
        backgroundColor: data.color1 ?? "green",
      }}
    >
      <div className="ease left-0 right-0 top-0 z-30 flex transition-all duration-150 dark:bg-black dark:text-white">
        <div className="mx-auto flex h-full max-w-screen-xl items-center justify-center space-x-5 p-10 sm:p-20">
          <Link href="/" className="flex items-center justify-center">
            <div className="">
              <Image
                alt={data.name || ""}
                height={80}
                src={data.logo || ""}
                width={200}
              />
            </div>
            <div
              className="pt-1font-title ml-3 rounded-full bg-blue-200 px-8 py-2 pt-1 font-title font-medium text-white"
              style={{ backgroundColor: data.color2 }}
            >
              play
            </div>
          </Link>
        </div>
      </div>

      <div className="mx-auto flex h-full max-w-screen-xl items-center justify-center space-x-5 p-10 pt-0 sm:p-20 sm:pt-0">
        <Image
          alt={"Banner image"}
          width={1200}
          height={630}
          className="h-full w-full object-cover"
          src={data.image ?? "/placeholder.png"}
        />
      </div>

      <div className="mt-20">{children}</div>

      {domain == `demo.${process.env.NEXT_PUBLIC_ROOT_DOMAIN}` ||
      domain == `platformize.co` ? (
        <CTA />
      ) : (
        <ReportAbuse />
      )}
    </div>
  );
}
