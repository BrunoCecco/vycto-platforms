"use client";

import { SelectSite } from "@/lib/schema";
import { Button, Link, User } from "@nextui-org/react";
import { Session } from "next-auth";
import Image from "next/image";
import ReactFlagsSelect from "react-flags-select";

export default function ProfileBanner({
  session,
  siteData,
}: {
  session: Session;
  siteData: SelectSite;
}) {
  return (
    <div
      className="relative flex h-28 w-full items-center overflow-hidden rounded-md border-b-2 bg-content4 p-8 md:h-40"
      style={{ borderBottomColor: siteData.color1 }}
    >
      <div className="absolute left-0 right-0 z-0 mx-auto h-80 w-80 rounded-full bg-background/20" />
      <div className="relative z-20 h-20 w-20 overflow-hidden rounded-full md:h-32 md:w-32">
        <Image
          alt="Profile Picture"
          className="h-full w-full"
          src={
            session.user.image ||
            `https://avatar.vercel.sh/${session.user.email}`
          }
          fill
        />
      </div>
      <div className="z-20 ml-4 flex flex-col">
        <h1 className="text-lg font-semibold md:text-2xl">
          {session.user.name || session.user.email}
        </h1>
        <p className="rounded-md bg-background p-1 text-sm">
          @{session.user.username || session.user.email}
        </p>
      </div>
      <div className="ml-auto flex flex-col">
        <ReactFlagsSelect
          selectButtonClassName="!bg-content2 !rounded-xl !border-none !text-foreground !py-1 !px-2 after:!content-none"
          className="!rounded-xl !border-none !bg-content2 !p-0 !text-background after:!content-none"
          selected={session.user.country || ""}
          onSelect={() => null}
          disabled
        />
        {session.user.favouritePlayer ? (
          <h2 className="text-lg font-semibold">
            Favourite Player: {session.user.favouritePlayer}
          </h2>
        ) : null}
      </div>
    </div>
  );
}
