"use client";
import Form from "@/components/form";
import { redirect } from "next/navigation";
import { editUser } from "@/lib/actions";
import CombinedForm from "../form/combined";
import { useSession } from "next-auth/react";
import React, { useEffect } from "react";
import Loading from "@/components/ui/loading";
import useUserSession from "@/lib/hooks/useUserSession";
import { SelectSite } from "@/lib/schema";
import { useTranslations } from "next-intl";

export default function UserSettings({ siteData }: { siteData?: SelectSite }) {
  const t = useTranslations();
  const { user, session, status, update } = useUserSession({
    required: true,
    onUnauthenticated: () => redirect("/login"),
  });

  const handleSubmit = async (data: FormData, _id: string, key: string) => {
    const newValue = data.get(key) as string;
    if (!session) return;
    // @ts-expect-error
    if (session.user[key] === newValue) return;

    console.log("Updating user", key, newValue);
    // Update the user session directly
    await update({
      user: {
        ...session.user,
        [key]: newValue,
      },
    });

    return editUser(data, _id, key);
  };

  return session == undefined || user == undefined ? null : status ===
    "loading" ? (
    <Loading />
  ) : (
    <div className="flex flex-col space-y-12">
      <div className="flex flex-col space-y-6">
        <h1 className="font-cal text-3xl font-bold">{t("settings")}</h1>
        <div className="w-full rounded-lg border border-content3">
          <CombinedForm
            title={t("profile")}
            helpText="User details"
            termslink={siteData?.terms || undefined}
            privacylink={siteData?.privacypolicy || undefined}
            cookielink={siteData?.cookiepolicy || undefined}
            inputAttrs={[
              {
                name: "image",
                type: "file",
                defaultValue: session.user.image || "",
                label: "Profile Image",
              },
              {
                name: "name",
                type: "text",
                defaultValue: user?.name || "",
                label: "Full Name",
              },
              {
                name: "username",
                type: "text",
                defaultValue: session.user.username,
                maxLength: 32,
                label: "Username",
              },
              {
                name: "email",
                type: "text",
                defaultValue: session.user.email,
                label: "Email",
              },
              {
                name: "country",
                type: "text",
                defaultValue: user?.country || "",
                label: "Country",
              },
              {
                name: "favouritePlayer",
                type: "text",
                defaultValue: user?.favouritePlayer || "",
                label: "Favourite Player",
              },
              {
                name: "birthDate",
                type: "date",
                // regex for a YYYY-MM-DD date from the user?.birthDate
                defaultValue: user?.birthDate || "2003-01-02",
                label: "Birth Date",
              },
              {
                name: "locale",
                type: "text",
                defaultValue: user?.locale || "",
                label: "Language",
              },
              {
                name: "divider",
                type: "none",
                defaultValue: "",
                label: "",
              },
              {
                name: "fanzoneNotifications",
                type: "checkbox",
                defaultValue: user.fanzoneNotifications ? "true" : "false",
                label: "Fanzone Notifications",
              },
              {
                name: "prizeNotifications",
                type: "checkbox",
                defaultValue: user.prizeNotifications ? "true" : "false",
                label: "Prize Notifications",
              },
              {
                name: "newsletter",
                type: "checkbox",
                defaultValue: user.newsletter ? "true" : "false",
                label: "Newsletter",
              },
            ]}
            handleSubmit={handleSubmit}
          />
        </div>
      </div>
    </div>
  );
}
