import {
  getServerSession,
  Session,
  Theme,
  type NextAuthOptions,
} from "next-auth";
import db from "./db";
import { DrizzleAdapter } from "@auth/drizzle-adapter";
import { Adapter } from "next-auth/adapters";
import {
  accounts,
  sessions,
  siteRewards,
  users,
  verificationTokens,
} from "./schema";
import EmailProvider, {
  SendVerificationRequestParams,
} from "next-auth/providers/email";
import { createTransport } from "nodemailer";
import AppleProvider from "next-auth/providers/apple";
import FacebookProvider from "next-auth/providers/facebook";
import GoogleProvider from "next-auth/providers/google";
import { SUPER_ADMIN } from "./constants";

// Add this type declaration at the top of your file
declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      username: string;
      role: string;
      email: string;
      image: string;
      name: string;
      birthDate: string;
    };
  }
}

const VERCEL_DEPLOYMENT = !!process.env.VERCEL_URL;
export const authOptions: NextAuthOptions = {
  providers: [
    AppleProvider({
      clientId: process.env.APPLE_CLIENT_ID!,
      clientSecret: process.env.APPLE_CLIENT_SECRET!,
      allowDangerousEmailAccountLinking: true,
      authorization: {
        params: {
          scope: "name email",
          response_mode: "form_post",
          response_type: "code",
        },
      },
    }),
    GoogleProvider({
      clientId:
        "1093526144020-ugos7d10gau4t1n76g0k0va3oaljg6jn.apps.googleusercontent.com",
      clientSecret: "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",
      allowDangerousEmailAccountLinking: true,
    }),
    FacebookProvider({
      clientId: process.env.FACEBOOK_ID!,
      clientSecret: process.env.FACEBOOK_SECRET!,
    }),
    EmailProvider({
      server: {
        host: process.env.EMAIL_SERVER_HOST as string,
        port: parseInt(process.env.EMAIL_SERVER_PORT!) || 465,
        secure: true,
        auth: {
          user: process.env.EMAIL_SERVER_USER,
          pass: process.env.EMAIL_SERVER_PASSWORD,
        },
      },
      from: process.env.EMAIL_FROM,
      sendVerificationRequest: sendVerificationRequest,
    }),
  ],
  pages: {
    signIn: `/login`,
  },
  adapter: DrizzleAdapter(db, {
    usersTable: users,
    accountsTable: accounts,
    sessionsTable: sessions,
    verificationTokensTable: verificationTokens,
  }) as Adapter,
  session: { strategy: "jwt" },
  cookies: {
    callbackUrl: {
      name: `${VERCEL_DEPLOYMENT ? "__Secure-" : ""}next-auth.callback-url`,
      options: {
        httpOnly: false,
        sameSite: "none",
        path: "/",
        secure: VERCEL_DEPLOYMENT,
      },
    },
    pkceCodeVerifier: {
      name: `${VERCEL_DEPLOYMENT ? "__Secure-" : ""}next-auth.pkce.code_verifier`,
      options: {
        httpOnly: true,
        sameSite: "none",
        path: "/",
        secure: true,
      },
    },
    sessionToken: {
      name: `${VERCEL_DEPLOYMENT ? "__Secure-" : ""}next-auth.session-token`,
      options: {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        // When working on localhost, the cookie domain must be omitted entirely (https://stackoverflow.com/a/1188145)
        domain: VERCEL_DEPLOYMENT
          ? `.${process.env.NEXT_PUBLIC_ROOT_DOMAIN}`
          : undefined,
        secure: VERCEL_DEPLOYMENT,
      },
    },
  },
  callbacks: {
    // async signIn({ user, account, profile, email, credentials }) {
    //   console.error(
    //     "SIGN IN CALLBACK",
    //     user,
    //     account,
    //     profile,
    //     email,
    //     credentials,
    //   );
    //   const isAllowedToSignIn = true;
    //   if (isAllowedToSignIn) {
    //     return true;
    //   } else {
    //     // Return false to display a default error message
    //     return false;
    //     // Or you can return a URL to redirect to:
    //     // return '/unauthorized'
    //   }
    // },
    // async redirect({ url, baseUrl }) {
    //   console.error("REDIRECT CALLBACK", url, baseUrl);
    //   // Allows relative callback URLs
    //   if (url.startsWith("/")) return `${baseUrl}${url}`;
    //   // Allows callback URLs on the same origin
    //   else if (new URL(url).origin === baseUrl) return url;
    //   return baseUrl;
    // },
    jwt({ token, trigger, session, user }) {
      if (trigger === "update" && session?.user) {
        token.user = session?.user || token.user;
        token.name = session?.user?.name || token.name;
        token.email = session?.user?.email || token.email;
        token.picture = session?.user?.image || token.picture;
        return token;
      }
      if (user) {
        token.user = user;
      }
      return token;
    },
    session: async ({ session, token }) => {
      session.user = {
        // @ts-expect-error
        id: token.sub,
        // @ts-expect-error
        username: token?.user?.username || token?.user?.gh_username,
        name: token?.name || session.user.name,
        image: token?.picture || session.user.image,
        // @ts-expect-error
        email: token?.user?.email || session.user.email,
        // @ts-expect-error
        role: token?.user?.role || session.user.role,
        // @ts-expect-error
        birthDate: token?.user?.birthDate || session.user.birthDate,
      };
      return session;
    },
  },
};

export function withSuperAdminAuth(action: any) {
  return async (
    formData: FormData | null,
    userId: string,
    key: string | null,
  ) => {
    const session = await getServerSession(authOptions);
    if (!session) {
      return {
        error: "Not authenticated",
      };
    }

    return action(formData, userId, key);
  };
}

export function withSiteAuth(action: any) {
  return async (
    formData: FormData | null,
    siteId: string,
    key: string | null,
  ) => {
    const session = await getServerSession(authOptions);
    if (!session) {
      return {
        error: "Not authenticated",
      };
    }

    const site = await db.query.sites.findFirst({
      where: (sites, { eq }) => eq(sites.id, siteId),
    });

    const siteAdmins = await db.query.adminSites.findMany({
      where: (adminSites, { eq }) => eq(adminSites.siteId, siteId),
    });

    if (
      !site ||
      (site.userId !== session.user.id &&
        !siteAdmins.find((admin) => admin.email === session.user.email))
    ) {
      return {
        error: "Not authorized",
      };
    }

    return action(formData, site, key);
  };
}

export function withSiteRewardAuth(action: any) {
  return async (
    formData: FormData | null,
    siteRewardId: string,
    key: string | null,
  ) => {
    const session = await getServerSession(authOptions);
    if (!session) {
      return {
        error: "Not authenticated",
      };
    }

    const siteReward = await db.query.siteRewards.findFirst({
      where: (sites, { eq }) => eq(siteRewards.id, siteRewardId),
    });

    if (!siteReward) {
      return {
        error: "Site reward not found",
      };
    }

    const siteRewardSiteId = siteReward.siteId || "";

    const site = await db.query.sites.findFirst({
      where: (sites, { eq }) => eq(sites.id, siteRewardSiteId),
    });

    const siteAdmins = await db.query.adminSites.findMany({
      where: (adminSites, { eq }) => eq(adminSites.siteId, siteRewardSiteId),
    });

    if (
      !site ||
      (site.userId !== session.user.id &&
        !siteAdmins.find((admin) => admin.email === session.user.email))
    ) {
      return {
        error: "Not authorized",
      };
    }

    return action(formData, siteReward, key);
  };
}

export function withCompetitionAuth(action: any) {
  return async (
    formData: FormData | null,
    competitionId: string,
    key: string | null,
  ) => {
    const session = await getServerSession(authOptions);
    if (!session?.user.id) {
      return {
        error: "Not authenticated",
      };
    }

    const competition = await db.query.competitions.findFirst({
      where: (competitions, { eq }) => eq(competitions.id, competitionId),
      with: {
        site: true,
      },
    });

    const site = competition?.site;

    if (!site) {
      return {
        error: "Competition not found",
      };
    }

    const siteAdmins = await db.query.adminSites.findMany({
      where: (adminSites, { eq }) => eq(adminSites.siteId, site.id),
    });

    if (
      !competition ||
      (competition.userId !== session.user.id &&
        !siteAdmins.find((admin) => admin.email === session.user.email))
    ) {
      return {
        error: "Competition not found",
      };
    }

    return action(formData, competition, key);
  };
}

async function sendVerificationRequest(params: SendVerificationRequestParams) {
  const { identifier, url, provider, theme } = params;
  const { host } = new URL(url);

  const adminSites = await db.query.adminSites.findFirst({
    where: (adminSites, { eq }) => eq(adminSites.email, identifier),
    columns: {
      email: true,
    },
  });

  if (
    host.startsWith("app") &&
    (adminSites == undefined || adminSites.email == undefined)
  ) {
    throw new Error(
      `UNAUTHORIZED ACCOUNT: You do not have permissions to access the vycto admin dashboard`,
    );
  }
  const transport = createTransport(provider.server);
  const result = await transport.sendMail({
    to: identifier,
    from: provider.from,
    subject: `Sign in to ${host}`,
    text: text({ url, host }),
    html: html({ url, host, theme }),
  });
  const failed = result.rejected.concat(result.pending).filter(Boolean);
  if (failed.length) {
    throw new Error(`Email(s) (${failed.join(", ")}) could not be sent`);
  }
}

/**
 * Email HTML body
 * Insert invisible space into domains from being turned into a hyperlink by email
 * clients like Outlook and Apple mail, as this is confusing because it seems
 * like they are supposed to click on it to sign in.
 *
 * @note We don't add the email address to avoid needing to escape it, if you do, remember to sanitize it!
 */
function html(params: { url: string; host: string; theme: Theme }) {
  const { url, host, theme } = params;

  const escapedHost = host.replace(/\./g, "&#8203;.");

  const brandColor = theme.brandColor || "#346df1";
  const color = {
    background: "#f9f9f9",
    text: "#444",
    mainBackground: "#fff",
    buttonBackground: brandColor,
    buttonBorder: brandColor,
    buttonText: theme.buttonText || "#fff",
  };

  return `
<body style="background: ${color.background};">
  <table width="100%" border="0" cellspacing="20" cellpadding="0"
    style="background: ${color.mainBackground}; max-width: 600px; margin: auto; border-radius: 10px;">
    <tr>
      <td align="center"
        style="padding: 10px 0px; font-size: 22px; font-family: Helvetica, Arial, sans-serif; color: ${color.text};">
        <img src="https://app.vyctorewards.com/logo.png" alt="VYCTO" width="100" height="100" />
      </td>      
    </tr>
    <tr>    
      <td align="center"
        style="padding: 10px 0px; font-size: 22px; font-family: Helvetica, Arial, sans-serif; color: ${color.text};">
        Sign in to <strong>${escapedHost}</strong>
      </td>
    </tr>
    <tr>
      <td align="center" style="padding: 20px 0;">
        <table border="0" cellspacing="0" cellpadding="0">
          <tr>
            <td align="center" style="border-radius: 5px;" bgcolor="${color.buttonBackground}"><a href="${url}"
                target="_blank"
                style="font-size: 18px; font-family: Helvetica, Arial, sans-serif; color: ${color.buttonText}; text-decoration: none; border-radius: 5px; padding: 10px 20px; border: 1px solid ${color.buttonBorder}; display: inline-block; font-weight: bold;">Sign
                in</a></td>
          </tr>
        </table>
      </td>
    </tr>
    <tr>
      <td align="center"
        style="padding: 0px 0px 10px 0px; font-size: 16px; line-height: 22px; font-family: Helvetica, Arial, sans-serif; color: ${color.text};">
        If you did not request this email you can safely ignore it.
      </td>
    </tr>
  </table>
</body>
`;
}

/** Email Text body (fallback for email clients that don't render HTML, e.g. feature phones) */
function text({ url, host }: { url: string; host: string }) {
  return `Sign in to ${host}\n${url}\n\n`;
}
