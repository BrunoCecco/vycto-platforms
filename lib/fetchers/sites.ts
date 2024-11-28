// lib/getSiteData.ts
"use server";

import { unstable_cache } from "next/cache";
import db from "../db";
import { siteRewards, sites } from "../schema";
import { eq } from "drizzle-orm";

async function getSiteIdByDomain(domain: string) {
  const subdomain = domain.endsWith(`.${process.env.NEXT_PUBLIC_ROOT_DOMAIN}`)
    ? domain.replace(`.${process.env.NEXT_PUBLIC_ROOT_DOMAIN}`, "")
    : null;

  const site = await db
    .select({ id: sites.id })
    .from(sites)
    .where(
      subdomain
        ? eq(sites.subdomain, subdomain)
        : eq(sites.customDomain, domain),
    );
  return site[0].id;
}

export async function getSiteData(domain: string) {
  const subdomain = domain.endsWith(`.${process.env.NEXT_PUBLIC_ROOT_DOMAIN}`)
    ? domain.replace(`.${process.env.NEXT_PUBLIC_ROOT_DOMAIN}`, "")
    : null;

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

export async function getSiteDataById(siteId: string) {
  return await unstable_cache(
    async () => {
      return await db.query.sites.findFirst({
        where: eq(sites.id, siteId),
      });
    },
    [`${siteId}-metadata`],
    {
      revalidate: 900,
      tags: [`${siteId}-metadata`],
    },
  )();
}

export async function getSiteRewards(domain: string) {
  const siteId = await getSiteIdByDomain(domain);

  return await unstable_cache(
    async () => {
      return await db.query.siteRewards.findMany({
        where: eq(siteRewards.siteId, siteId),
      });
    },
    [`${siteId}-rewards`],
    {
      revalidate: 900,
      tags: [`${siteId}-rewards`],
    },
  )();
}

export async function getSiteRewardsForPeriod(
  domain: string,
  startDate: string,
  endDate: string,
) {
  const siteId = await getSiteIdByDomain(domain);

  return await unstable_cache(
    async () => {
      return await db.query.siteRewards.findMany({
        where: (rewards, { and, gte, lte }) =>
          and(
            gte(siteRewards.startDate, startDate),
            lte(siteRewards.endDate, endDate),
            eq(siteRewards.siteId, siteId),
          ),
      });
    },
    [`${siteId}-rewards-${startDate}-${endDate}`],
    {
      revalidate: 900,
      tags: [`${siteId}-rewards-${startDate}-${endDate}`],
    },
  )();
}
