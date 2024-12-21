import { notFound, redirect } from "next/navigation";
import {
  getAnswersForUser,
  getCompetitionData,
  getCompetitionUsers,
  getQuestionsForCompetition,
  getSiteData,
  getUserCompetition,
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

// export async function generateMetadata({
//   params,
// }: {
//   params: { domain: string; slug: string };
// }) {
//   const domain = decodeURIComponent(params.domain);
//   const slug = decodeURIComponent(params.slug);

//   const [data, siteData] = await Promise.all([
//     getCompetitionData(domain, slug),
//     getSiteData(domain),
//   ]);
//   if (!data || !siteData) {
//     return null;
//   }
//   const { title, description } = data;

//   return {
//     title,
//     description,
//     openGraph: {
//       title,
//       description,
//     },
//     twitter: {
//       card: "summary_large_image",
//       title,
//       description,
//       creator: "@vercel",
//     },
//     // Optional: Set canonical URL to custom domain if it exists
//     // ...(params.domain.endsWith(`.${process.env.NEXT_PUBLIC_ROOT_DOMAIN}`) &&
//     //   siteData.customDomain && {
//     //     alternates: {
//     //       canonical: `https://${siteData.customDomain}/${params.slug}`,
//     //     },
//     //   }),
//   };
// }

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

export default async function SubmissionPage({
  params,
}: {
  params: { domain: string; slug: string; submissionId: string };
}) {
  const domain = decodeURIComponent(params.domain);
  const slug = decodeURIComponent(params.slug);
  const submissionId = decodeURIComponent(params.submissionId);
  const siteData = await getSiteData(domain);
  const session = await getServerSession(authOptions);
  const data = await getCompetitionData(domain, slug);

  if (!data) {
    notFound();
  }

  const questions = await getQuestionsForCompetition(data.id);
  const answers = await getAnswersForUser(submissionId, data.id);
  console.log(answers, submissionId, data.id);

  let userComp: SelectUserCompetition | undefined;
  if (session) {
    let enterRes = await enterUserToCompetition(
      submissionId,
      session.user.username,
      session.user.name,
      session.user.email,
      data.id,
      session.user.image || "",
    );
    if (!("error" in enterRes)) {
      userComp = enterRes;
    }
  } else {
    userComp = await getUserCompetition(submissionId, data.id);
  }

  const users = await getCompetitionUsers(data!.id);
  var sortedUsers = users.sort((a: any, b: any) => b.points - a.points);

  return (
    <div className="">
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
    </div>
  );
}
