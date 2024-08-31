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
import { getSession } from "@/lib/auth";
import CompetitionPage from "@/components/competitionPage";

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
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      creator: "@vercel",
    },
    // Optional: Set canonical URL to custom domain if it exists
    // ...(params.domain.endsWith(`.${process.env.NEXT_PUBLIC_ROOT_DOMAIN}`) &&
    //   siteData.customDomain && {
    //     alternates: {
    //       canonical: `https://${siteData.customDomain}/${params.slug}`,
    //     },
    //   }),
  };
}

export async function generateStaticParams() {
  const allCompetitions = await db
    .select({
      slug: competitions.slug,
      site: {
        subdomain: sites.subdomain,
        customDomain: sites.customDomain,
      },
    })
    .from(competitions)
    .leftJoin(sites, eq(competitions.siteId, sites.id));

  const allPaths = allCompetitions
    .flatMap(({ site, slug }) => [
      site?.subdomain && {
        domain: `${site.subdomain}.${process.env.NEXT_PUBLIC_ROOT_DOMAIN}`,
        slug,
      },
      site?.customDomain && {
        domain: site.customDomain,
        slug,
      },
    ])
    .filter(Boolean);

  return allPaths;
}

export default async function SubmissionPage({
  params,
}: {
  params: { domain: string; slug: string; submissionId: string };
}) {
  const domain = decodeURIComponent(params.domain);
  const slug = decodeURIComponent(params.slug);
  const siteData = await getSiteData(domain);
  const session = await getSession();
  const data = await getCompetitionData(domain, slug);

  if (!data) {
    notFound();
  }

  let users;
  let userComp: SelectUserCompetition | undefined | { error: string };
  const questions = await getQuestionsForCompetition(data.id);
  const answers = await getAnswersForUser(session?.user.id!, data!.id);

  if (session && data) {
    userComp = await enterUserToCompetition(
      session.user.id,
      session.user.username || session.user.name || session.user.email,
      data.id,
    );
    if (!userComp || "submitted" in userComp == false || !userComp.submitted) {
      redirect(`/${domain}/${slug}`);
    }
    users = await getCompetitionUsers(data!.id);
  }

  return (
    <div
      className=""
      style={{
        backgroundColor: siteData?.color1 ?? "white",
      }}
    >
      <div className="mx-auto w-full md:w-3/4 lg:w-3/5">
        <CompetitionPage
          session={session}
          data={data}
          siteData={siteData}
          questions={questions}
          answers={answers}
          users={users}
          userComp={userComp}
          slug={slug}
        />
      </div>
    </div>
  );
}
