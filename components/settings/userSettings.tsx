import Form from "@/components/form";
import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import { editUser } from "@/lib/actions";
import LogoutButton from "../auth/logoutButton";
import Image from "next/image";
import { PencilIcon } from "lucide-react";
import EditProfileImage from "./editProfileImage";

export default async function UserSettings() {
  const session = await getSession();
  if (!session) {
    redirect("/login");
  }

  return (
    <div className="flex flex-col space-y-12 p-8">
      <div className="flex flex-col space-y-6">
        <h1 className="font-cal text-3xl font-bold dark:text-white">
          Settings
        </h1>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <EditProfileImage session={session} />
          <Form
            title="Name"
            description="Your full name."
            helpText="Please enter your first and last name."
            inputAttrs={{
              name: "name",
              type: "text",
              defaultValue: session.user.name!,
              placeholder: "Full Name",
            }}
            handleSubmit={editUser}
          />
          <Form
            title="Username"
            description="Your username displayed on leaderboards."
            helpText="Please use 32 characters maximum."
            inputAttrs={{
              name: "username",
              type: "text",
              defaultValue: session.user.username!,
              placeholder: "user123",
              maxLength: 32,
            }}
            handleSubmit={editUser}
          />
        </div>
      </div>
    </div>
  );
}
