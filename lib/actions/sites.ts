"use server";

import {
  addDomainToVercel,
  removeDomainFromVercelProject,
  validDomainRegex,
} from "@/lib/domains";
import { eq } from "drizzle-orm";
import { customAlphabet } from "nanoid";
import { revalidateTag } from "next/cache";
import { authOptions, withSiteAuth, withSiteRewardAuth } from "../auth";
import db from "../db";
import {
  SelectSite,
  SelectSiteReward,
  adminSites,
  competitions,
  siteRewards,
  sites,
} from "../schema";
import { getServerSession } from "next-auth";
import { getSiteAdmins, getUserData } from "../fetchers";

export const createSite = async (formData: FormData) => {
  const session = await getServerSession(authOptions);
  if (!session?.user.id) {
    return {
      error: "Not authenticated",
    };
  }
  const name = formData.get("name") as string;
  const description = formData.get("description") as string;
  const subdomain = formData.get("subdomain") as string;

  try {
    let headers = {
      Authorization: `Bearer ${process.env.SENDER_API_KEY}`,
      "Content-Type": "application/json",
      Accept: "application/json",
    };

    const senderResponse = await fetch("https://api.sender.net/v2/groups", {
      method: "POST",
      headers,
      body: JSON.stringify({
        title: name,
      }),
    });
    const data = await senderResponse.json();

    const [response] = await db
      .insert(sites)
      .values({
        name,
        description,
        subdomain,
        userId: session.user.id,
        senderGroup: data?.data?.id || "",
      })
      .returning();

    // create site admin
    await db
      .insert(adminSites)
      .values({
        email: session.user.email,
        siteId: response.id,
      })
      .returning();

    revalidateTag(
      `${subdomain}.${process.env.NEXT_PUBLIC_ROOT_DOMAIN}-metadata`,
    );
    return response;
  } catch (error: any) {
    if (error.code === "P2002") {
      return {
        error: `This subdomain is already taken`,
      };
    } else {
      return {
        error: error.message,
      };
    }
  }
};

export const updateSite = withSiteAuth(
  async (formData: FormData, site: SelectSite, key: string) => {
    const value = formData.get(key) as string;

    try {
      let response;

      if (key === "customDomain") {
        if (value.includes("vercel.pub")) {
          return {
            error: "Cannot use vercel.pub subdomain as your custom domain",
          };

          // if the custom domain is valid, we need to add it to Vercel
        } else if (validDomainRegex.test(value)) {
          response = await db
            .update(sites)
            .set({
              customDomain: value,
            })
            .where(eq(sites.id, site.id))
            .returning()
            .then((res) => res[0]);

          await Promise.all([
            addDomainToVercel(value),
            // Optional: add www subdomain as well and redirect to apex domain
            // addDomainToVercel(`www.${value}`),
          ]);

          // empty value means the user wants to remove the custom domain
        } else if (value === "") {
          response = await db
            .update(sites)
            .set({
              customDomain: null,
            })
            .where(eq(sites.id, site.id))
            .returning()
            .then((res) => res[0]);
        }

        // if the site had a different customDomain before, we need to remove it from Vercel
        if (site.customDomain && site.customDomain !== value) {
          response = await removeDomainFromVercelProject(site.customDomain);

          /* Optional: remove domain from Vercel team
          // first, we need to check if the apex domain is being used by other sites
          const apexDomain = getApexDomain(`https://${site.customDomain}`);
          const domainCount = await db.select({ count: count() }).from(sites).where(or(eq(sites.customDomain, apexDomain), ilike(sites.customDomain, `%.${apexDomain}`))).then((res) => res[0].count);
          // if the apex domain is being used by other sites
          // we should only remove it from our Vercel project
          if (domainCount >= 1) {
            await removeDomainFromVercelProject(site.customDomain);
          } else {
            // this is the only site using this apex domain
            // so we can remove it entirely from our Vercel team
            await removeDomainFromVercelTeam(
              site.customDomain
            );
          }
          */
        }
      } else {
        response = await db
          .update(sites)
          .set({
            [key]: value,
          })
          .where(eq(sites.id, site.id))
          .returning()
          .then((res) => res[0]);
      }

      console.log(
        "Updated site data! Revalidating tags: ",
        `${site.subdomain}.${process.env.NEXT_PUBLIC_ROOT_DOMAIN}-metadata`,
        `${site.customDomain}-metadata`,
      );
      revalidateTag(
        `${site.subdomain}.${process.env.NEXT_PUBLIC_ROOT_DOMAIN}-metadata`,
      );
      site.customDomain && revalidateTag(`${site.customDomain}-metadata`);

      return response;
    } catch (error: any) {
      if (error.code === "P2002") {
        return {
          error: `This ${key} is already taken`,
        };
      } else {
        return {
          error: error.message,
        };
      }
    }
  },
);

export const deleteSite = withSiteAuth(
  async (_: FormData, site: SelectSite) => {
    try {
      const [response] = await db
        .delete(sites)
        .where(eq(sites.id, site.id))
        .returning();

      const admins = await db.query.adminSites.findMany({
        where: eq(adminSites.siteId, site.id),
      });

      revalidateTag(
        `${site.subdomain}.${process.env.NEXT_PUBLIC_ROOT_DOMAIN}-metadata`,
      );

      admins.forEach(async (admin) => {
        revalidateTag(`${admin.email}-admin-sites`);
        revalidateTag(`admin-sites-${admin.email}`);
      });

      response.customDomain && revalidateTag(`${site.customDomain}-metadata`);
      return response;
    } catch (error: any) {
      return {
        error: error.message,
      };
    }
  },
);

export const createSiteReward = async (formData: FormData) => {
  console.log("Creating site reward", formData);
  const session = await getServerSession(authOptions);
  if (!session?.user.id) {
    return {
      error: "Not authenticated",
    };
  }
  const title = formData.get("title") as string;
  const description = formData.get("description") as string;
  const image = formData.get("image") as string;
  const siteId = formData.get("siteId") as string;
  const month_ = formData.get("month") as string;
  const year_ = formData.get("year") as string;
  const rewardWinners_ = formData.get("rewardWinners") as string;
  const sponsor = formData.get("sponsor") as string;

  const month = parseInt(month_ || "1");
  const year = parseInt(year_ || "2025");
  const rewardWinners = parseInt(rewardWinners_ || "1");

  try {
    const [response] = await db
      .insert(siteRewards)
      .values({
        siteId,
        title,
        description,
        sponsor,
        image,
        rewardWinners,
        month,
        year,
      })
      .returning();

    revalidateTag(
      `${siteId}-reward.${process.env.NEXT_PUBLIC_ROOT_DOMAIN}-metadata`,
    );
    revalidateTag(`${siteId}-rewards`);
    return response;
  } catch (error: any) {
    return {
      error: error.message,
    };
  }
};

export const updateSiteReward = withSiteRewardAuth(
  async (formData: FormData, siteReward: SelectSiteReward, key: string) => {
    const value = formData.get(key) as string;

    try {
      let response;

      response = await db
        .update(siteRewards)
        .set({
          [key]: value,
        })
        .where(eq(siteRewards.id, siteReward.id))
        .returning()
        .then((res) => res[0]);

      revalidateTag(
        `${siteReward.id}-reward.${process.env.NEXT_PUBLIC_ROOT_DOMAIN}-metadata`,
      );
      revalidateTag(`${siteReward.siteId}-rewards`);
      revalidateTag(
        `${siteReward.siteId}-reward-${siteReward.month}-${siteReward.year}`,
      );

      return response;
    } catch (error: any) {
      return {
        error: error.message,
      };
    }
  },
);

export const getSiteFromCompetitionId = async (competitionId: string) => {
  console.log("Getting site from competition ID: ", competitionId);
  const competition = await db.query.competitions.findFirst({
    where: eq(competitions.id, competitionId),
    columns: {
      siteId: true,
    },
  });

  return competition?.siteId;
};

export const createSiteAdmin = async (
  siteId: string,
  email: string,
  verify: boolean = true,
) => {
  const session = await getServerSession(authOptions);
  if (!session?.user.id) {
    return {
      error: "Not authenticated",
    };
  }
  const siteAdmins = await getSiteAdmins(siteId);

  if (
    verify &&
    !siteAdmins.some((admin) => admin.email === session.user.email)
  ) {
    console.log(
      "User is not an admin of this site",
      siteAdmins,
      session.user.id,
      siteId,
    );
    return {
      error: "You are not authorized to add admins to this site",
    };
  }

  try {
    const [response] = await db
      .insert(adminSites)
      .values({
        email: email,
        siteId,
      })
      .returning();

    revalidateTag(`${email}-admin-sites`);
    revalidateTag(`site-admins-${siteId}`);
    revalidateTag(`admin-sites-${email}`);
    return response;
  } catch (error: any) {
    return {
      error: error.message,
    };
  }
};

export const deleteSiteAdmin = async (siteId: string, email: string) => {
  const session = await getServerSession(authOptions);
  if (!session?.user.id) {
    return {
      error: "Not authenticated",
    };
  }
  const siteAdmins = await db.query.adminSites.findMany({
    where: eq(adminSites.siteId, siteId),
  });
  if (!siteAdmins.some((admin) => admin.email === session.user.email)) {
    return {
      error: "You are not authorized to remove admins from this site",
    };
  }

  try {
    const [response] = await db
      .delete(adminSites)
      .where(eq(adminSites.email, email))
      .returning();

    revalidateTag(`${email}-admin-sites`);
    revalidateTag(`site-admins-${siteId}`);
    revalidateTag(`admin-sites-${email}`);
    return response;
  } catch (error: any) {
    return {
      error: error.message,
    };
  }
};
