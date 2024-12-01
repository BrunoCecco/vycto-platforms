"use client";
import { redirect } from "next/navigation";
import { Link, User } from "@nextui-org/react";
import Image from "next/image";
import LogoutButton from "../auth/logoutButton";
import { useSession } from "next-auth/react";
import { PencilIcon } from "lucide-react";

export default function Profile() {
  const { data: session, status, update } = useSession();

  return (
    session && (
      <div className="flex w-full items-center justify-between">
        <User
          name={
            session.user.name || session.user.username || session.user.email
          }
          avatarProps={{
            src:
              session.user.image ||
              `https://avatar.vercel.sh/${session.user.email}`,
          }}
        />
        <Link href="/settings">
          <PencilIcon size={18} />
        </Link>
        <LogoutButton />
      </div>
    )
  );
}
