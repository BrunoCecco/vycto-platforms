"use client";
import { redirect } from "next/navigation";
import { Link, User } from "@nextui-org/react";
import Image from "next/image";
import LogoutButton from "../auth/logoutButton";
import { useSession } from "next-auth/react";
import { PencilIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { SelectUser } from "@/lib/schema";
import useUserSession from "@/lib/hooks/useUserSession";

export default function Profile() {
  const { user, session, status, update } = useUserSession({});

  return (
    session && (
      <div className="flex w-full flex-wrap items-center justify-between gap-1">
        <User
          name={session.user.username || user?.name || session.user.email}
          avatarProps={{
            src:
              session.user?.image ||
              `https://avatar.vercel.sh/${session.user.email}`,
          }}
        />
        {/* <Link href="/settings" className="text-foreground">
          <PencilIcon size={18} />
        </Link> */}
        <LogoutButton />
      </div>
    )
  );
}
