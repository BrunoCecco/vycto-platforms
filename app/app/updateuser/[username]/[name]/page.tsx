"use client";

import { updateName, updateUsername } from "@/lib/actions";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import { useEffect } from "react";

export default async function UpdateUserNameAndName({
  params,
}: {
  params: { username: string; name: string };
}) {
  const username = params.username;
  const name = params.name;
  const { data: session, status, update } = useSession();

  useEffect(() => {
    const updateNameAndUsername = async () => {
      if (!session || !session.user) return;
      console.log(params.username, params.name, params);
      if (username) {
        await updateUsername(username, session?.user.email as string);
        await update({
          user: {
            ...session.user,
            username: username,
          },
        });
      }
      if (name) {
        await updateName(name, session?.user.email as string);
        await update({
          user: {
            ...session.user,
            name: name,
          },
        });
      }
    };
    updateNameAndUsername();
    redirect("/");
  }, []);
}
