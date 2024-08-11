import { unstable_cache } from "next/cache";
import db from "./db";
import { and, desc, eq, not } from "drizzle-orm";
import { competitions, sites, users } from "./schema";
import { serialize } from "next-mdx-remote/serialize";
import { replaceExamples, replaceTweets } from "@/lib/remark-plugins";

export async function getSiteData(domain: string) {
  const subdomain = domain.endsWith(`.${process.env.NEXT_PUBLIC_ROOT_DOMAIN}`)
    ? domain.replace(`.${process.env.NEXT_PUBLIC_ROOT_DOMAIN}`, "")
    : null;

  console.log(sites);

  return await unstable_cache(
    async () => {
      return await db.query.sites.findFirst({
        where: subdomain
          ? eq(sites.subdomain, subdomain)
          : eq(sites.customDomain, domain),
        with: {
          user: true,
        },
      });
    },
    [`${domain}-metadata`],
    {
      revalidate: 900,
      tags: [`${domain}-metadata`],
    },
  )();
}

export async function getCompetitionsForSite(domain: string) {
  const subdomain = domain.endsWith(`.${process.env.NEXT_PUBLIC_ROOT_DOMAIN}`)
    ? domain.replace(`.${process.env.NEXT_PUBLIC_ROOT_DOMAIN}`, "")
    : null;

  return await unstable_cache(
    async () => {
      return await db
        .select({
          title: competitions.title,
          description: competitions.description,
          slug: competitions.slug,
          image: competitions.image,
          imageBlurhash: competitions.imageBlurhash,
          createdAt: competitions.createdAt,
        })
        .from(competitions)
        .leftJoin(sites, eq(competitions.siteId, sites.id))
        .where(
          and(
            eq(competitions.published, true),
            subdomain
              ? eq(sites.subdomain, subdomain)
              : eq(sites.customDomain, domain),
          ),
        )
        .orderBy(desc(competitions.createdAt));
    },
    [`${domain}-competitions`],
    {
      revalidate: 900,
      tags: [`${domain}-competitions`],
    },
  )();
}

export async function getCompetitionData(domain: string, slug: string) {
  const subdomain = domain.endsWith(`.${process.env.NEXT_PUBLIC_ROOT_DOMAIN}`)
    ? domain.replace(`.${process.env.NEXT_PUBLIC_ROOT_DOMAIN}`, "")
    : null;

  return await unstable_cache(
    async () => {
      const data = await db
        .select({
          competition: competitions,
          site: sites,
          user: users,
        })
        .from(competitions)
        .leftJoin(sites, eq(sites.id, competitions.siteId))
        .leftJoin(users, eq(users.id, sites.userId))
        .where(
          and(
            eq(competitions.slug, slug),
            eq(competitions.published, true),
            subdomain
              ? eq(sites.subdomain, subdomain)
              : eq(sites.customDomain, domain),
          ),
        )
        .then((res) =>
          res.length > 0
            ? {
                ...res[0].competition,
                site: res[0].site
                  ? {
                      ...res[0].site,
                      user: res[0].user,
                    }
                  : null,
              }
            : null,
        );

      if (!data) return null;

      const [mdxSource, adjacentCompetitions] = await Promise.all([
        getMdxSource(data.content!),
        db
          .select({
            slug: competitions.slug,
            title: competitions.title,
            createdAt: competitions.createdAt,
            description: competitions.description,
            image: competitions.image,
            imageBlurhash: competitions.imageBlurhash,
          })
          .from(competitions)
          .leftJoin(sites, eq(sites.id, competitions.siteId))
          .where(
            and(
              eq(competitions.published, true),
              not(eq(competitions.id, data.id)),
              subdomain
                ? eq(sites.subdomain, subdomain)
                : eq(sites.customDomain, domain),
            ),
          ),
      ]);

      return {
        ...data,
        mdxSource,
        adjacentCompetitions,
      };
    },
    [`${domain}-${slug}`],
    {
      revalidate: 900, // 15 minutes
      tags: [`${domain}-${slug}`],
    },
  )();
}

async function getMdxSource(competitionContents: string) {
  // transforms links like <link> to [link](link) as MDX doesn't support <link> syntax
  // https://mdxjs.com/docs/what-is-mdx/#markdown
  const content =
    competitionContents?.replaceAll(/<(https?:\/\/\S+)>/g, "[$1]($1)") ?? "";
  // Serialize the content string into MDX
  const mdxSource = await serialize(content, {
    mdxOptions: {
      remarkPlugins: [replaceTweets, () => replaceExamples(db)],
    },
  });

  return mdxSource;
}

export async function getUserData(email: string) {
  return await unstable_cache(
    async () => {
      return await db.query.users.findFirst({
        where: eq(users.email, email),
      });
    },
    [`${email}-user`],
    {
      revalidate: 900,
      tags: [`${email}-user`],
    },
  )();
}
