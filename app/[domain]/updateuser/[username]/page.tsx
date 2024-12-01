"use client";

import { updateUsername } from "@/lib/actions";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import { useEffect } from "react";

export default function UpdateUserNameAndName({
  params,
}: {
  params: { username: string };
}) {
  const username = params.username;
  const { data: session, status, update } = useSession();

  useEffect(() => {
    const updateNameAndUsername = async () => {
      if (!session || !session.user) return;
      if (username) {
        await updateUsername(username, session?.user.email as string);
        await update({
          user: {
            ...session.user,
            username: username,
          },
        });
      }
    };
    updateNameAndUsername();
    redirect("/");
  }, []);
}
