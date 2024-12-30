"use client";

import { updateUserOnLogin } from "@/lib/actions";
import { Spinner } from "@nextui-org/react";
import { useSession } from "next-auth/react";
import { redirect, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function UpdateUser() {
  const searchParams = useSearchParams();
  const username = searchParams.get("username");
  const name = searchParams.get("name");
  const birthDate = searchParams.get("birthDate");
  const { data: session, status, update } = useSession();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const updateUser = async () => {
      if (!session || !session.user) return;
      if (username && username.trim().length > 0) {
        await updateUserOnLogin(
          session?.user.email as string,
          "username",
          username || "",
        );
      }
      if (name && name.trim().length > 0) {
        await updateUserOnLogin(
          session?.user.email as string,
          "name",
          name || "",
        );
      }
      if (birthDate && birthDate.trim().length > 0) {
        await updateUserOnLogin(
          session?.user.email as string,
          "birthDate",
          birthDate || "",
        );
      }
      await update({
        user: {
          ...session.user,
          username: username || session.user.username,
          name: name || session.user.name,
        },
      });
      setLoading(false);
    };
    updateUser();
  }, [session]);

  useEffect(() => {
    if (!loading) {
      redirect("/");
    }
  }, [loading]);

  return loading ? <Spinner /> : <div>Welcome to Vycto! Redirecting....</div>;
}
