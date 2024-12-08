// hook that uses /api/user/[email] to fetch user data from the database

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { SelectUser } from "@/lib/schema";
import { redirect } from "next/navigation";

export default function useUserSession({
  required = false,
  onUnauthenticated = () => null,
}: {
  required?: boolean;
  onUnauthenticated?: () => void;
}) {
  const {
    data: session,
    status,
    update,
  } = useSession({
    required: required,
    onUnauthenticated: onUnauthenticated,
  });

  const [user, setUser] = useState<SelectUser>();

  useEffect(() => {
    if (!session) return;
    fetch(`/api/user/${session?.user.email}`)
      .then(async (res) => {
        const data = await res.json();
        setUser(data);
      })
      .catch((err) => {
        console.error(err);
      });
  }, [session, status, update]);

  return { user, session, status, update };
}
