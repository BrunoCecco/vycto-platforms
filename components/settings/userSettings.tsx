import Form from "@/components/form";
import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import { editUser } from "@/lib/actions";
import LogoutButton from "../auth/logout-button";

export default async function UserSettings() {
  const session = await getSession();
  if (!session) {
    redirect("/login");
  }

  return (
    <div className="flex max-w-screen-xl flex-col space-y-12 p-8">
      <div className="flex flex-col space-y-6">
        <h1 className="font-cal text-3xl font-bold dark:text-white">
          Settings
        </h1>
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
  );
}
