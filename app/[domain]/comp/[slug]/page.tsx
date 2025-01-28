import { notFound, redirect } from "next/navigation";
import {
  getAnswersForUser,
  getCompetitionData,
  getCompetitionUsers,
  getQuestionsForCompetition,
  getSiteData,
} from "@/lib/fetchers";
import db from "@/lib/db";
import {
  competitions,
  SelectQuestion,
  SelectUserCompetition,
  sites,
} from "@/lib/schema";
import { eq } from "drizzle-orm";
import {
  answerQuestion,
  enterUserToCompetition,
  submitAnswers,
} from "@/lib/actions";
import CompetitionPage from "@/components/competitions/competitionPage";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { Suspense } from "react";
import { Spinner } from "@nextui-org/react";
import { icons } from "lucide-react";

export async function generateMetadata({
  params,
}: {
  params: { domain: string; slug: string };
}) {
  const domain = decodeURIComponent(params.domain);
  const slug = decodeURIComponent(params.slug);

  const [data, siteData] = await Promise.all([
    getCompetitionData(domain, slug),
    getSiteData(domain),
  ]);
  if (!data || !siteData) {
    return null;
  }
  const { title, description } = data;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: [siteData.loginBanner],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [siteData.loginBanner],
    },
    icons: [siteData.logo], // this is the favicon
    // Optional: Set canonical URL to custom domain if it exists
    // ...(params.domain.endsWith(`.${process.env.NEXT_PUBLIC_ROOT_DOMAIN}`) &&
    //   siteData.customDomain && {
    //     alternates: {
    //       canonical: `https://${siteData.customDomain}/${params.slug}`,
    //     },
    //   }),
  };
}

// export async function generateStaticParams() {
//   const allCompetitions = await db
//     .select({
//       slug: competitions.slug,
//       site: {
//         subdomain: sites.subdomain,
//         customDomain: sites.customDomain,
//       },
//     })
//     .from(competitions)
//     .leftJoin(sites, eq(competitions.siteId, sites.id));

//   const allPaths = allCompetitions
//     .flatMap(({ site, slug }) => [
//       site?.subdomain && {
//         domain: `${site.subdomain}.${process.env.NEXT_PUBLIC_ROOT_DOMAIN}`,
//         slug,
//       },
//       site?.customDomain && {
//         domain: site.customDomain,
//         slug,
//       },
//     ])
//     .filter(Boolean);

//   return allPaths;
// }

export default async function SiteCompetitionPage({
  params,
}: {
  params: { domain: string; slug: string };
}) {
  const domain = decodeURIComponent(params.domain);
  const siteData = await getSiteData(domain);
  const slug = decodeURIComponent(params.slug);
  const session = await getServerSession(authOptions);
  const data = await getCompetitionData(domain, slug);
  if (!data) {
    notFound();
  }

  const questions = await getQuestionsForCompetition(data.id);
  const answers = session
    ? await getAnswersForUser(session?.user.id!, data.id)
    : undefined;

  let userComp = session
    ? await enterUserToCompetition(
        session.user.id,
        session.user.username,
        session.user.name,
        session.user.email,
        data.id,
        siteData?.id!,
        session.user.image || "",
      )
    : undefined;
  if (userComp != undefined && "error" in userComp) {
    userComp = undefined;
  }
  if (userComp && "submitted" in userComp && userComp.submitted) {
    redirect(`/comp/${slug}/${userComp.userId}`);
  }
  const users = await getCompetitionUsers(data!.id);
  var sortedUsers = users.sort((a: any, b: any) => b.points - a.points);
  return (
    <Suspense fallback={<Spinner />}>
      <CompetitionPage
        session={session}
        data={data}
        siteData={siteData}
        questions={questions}
        answers={answers}
        users={sortedUsers}
        userComp={userComp}
        slug={slug}
      />
      {/* {data.adjacentCompetitions.length > 0 && (
        <div className="relative pb-20 pt-10 sm:pt-20">
          <div
            className="absolute inset-0 z-10 flex items-center"
            aria-hidden="true"
          >
            <div className="w-full border-t border-stone-300 dark:border-stone-700" />
          </div>
          <div className="relative z-20 mx-auto w-fit rounded-full bg-white px-6 text-center text-sm text-stone-500  dark:text-stone-400">
            More competitions
          </div>
        </div>
      )}
      {data.adjacentCompetitions && (
        <div className="mx-5 grid  grid-cols-1 gap-x-4 gap-y-8 pb-12 md:grid-cols-2 xl:mx-auto xl:grid-cols-3">
          {data.adjacentCompetitions.map((data: any, index: number) => (
            <BlogCard key={index} data={data} />
          ))}
        </div>
      )} */}
    </Suspense>
  );
}
