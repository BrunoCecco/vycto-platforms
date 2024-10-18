"use client";
import Form from "@/components/form";
import { redirect } from "next/navigation";
import { editUser } from "@/lib/actions";
import LogoutButton from "../auth/logoutButton";
import EditProfileImage from "./editProfileImage";
import CountryPicker from "./countryPicker";
import CombinedForm from "../form/combined";
import { useSession } from "next-auth/react";
import React, { useEffect } from "react";
import Loading from "@/app/app/(dashboard)/loading";

export default function UserSettings() {
  const {
    data: session,
    status,
    update,
  } = useSession({
    required: true,
    onUnauthenticated: () => redirect("/login"),
  });

  const handleSubmit = async (data: FormData, _id: string, key: string) => {
    const newValue = data.get(key) as string;
    if (!session) return;
    // @ts-expect-error
    if (session.user[key] === newValue) return { error: "No changes made." };

    // Update the user session directly
    await update({
      user: {
        ...session.user,
        [key]: newValue,
      },
    });

    return editUser(data, _id, key);
  };

  return status === "loading" ? (
    <Loading />
  ) : (
    <div className="flex flex-col space-y-12">
      <div className="flex flex-col space-y-6">
        <h1 className="font-cal text-3xl font-bold dark:text-white">
          Settings
        </h1>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-1">
          <div className="w-full sm:w-fit">
            <EditProfileImage />
          </div>
          <CombinedForm
            title={"User Profile"}
            descriptions={[
              "Your Full Name",
              "Your username displayed on leaderboards.",
              "Your email.",
              "Your country of residence.",
            ]}
            helpText="User details"
            inputAttrs={[
              {
                name: "name",
                type: "text",
                defaultValue: session.user.name!,
                placeholder: "Full Name",
              },
              {
                name: "username",
                type: "text",
                defaultValue: session.user.username!,
                placeholder: "user123",
                maxLength: 32,
              },
              {
                name: "email",
                type: "text",
                defaultValue: session.user.email!,
                placeholder: "Email",
              },
              {
                name: "country",
                type: "text",
                defaultValue: session.user.country!,
                placeholder: "Country",
              },
            ]}
            handleSubmit={handleSubmit}
          />
        </div>
      </div>
    </div>
  );
}
