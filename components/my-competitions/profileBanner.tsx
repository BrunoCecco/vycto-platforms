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
      className="relative flex h-28 w-full items-center overflow-hidden rounded-md border-b-2 bg-gradient-to-b from-content4 via-content4 to-content2 p-4 md:h-40 md:p-8"
      style={{ borderBottomColor: siteData.color1 }}
    >
      <div className="absolute left-0 right-0 z-0 mx-auto h-80 w-80 rounded-full bg-background/20" />
      <div className="relative z-20 h-12 w-12 overflow-hidden rounded-full md:h-32 md:w-32">
        <Image
          alt="Profile Picture"
          className="h-full w-full object-cover"
          src={
            session.user.image ||
            `https://avatar.vercel.sh/${session.user.email}`
          }
          fill
        />
      </div>
      <div className="z-20 ml-2 flex flex-col md:ml-4">
        <h1 className="text-sm font-semibold md:text-2xl">
          {session.user.name || session.user.email}
        </h1>
        <p className="w-fit rounded-md text-xs md:bg-background md:p-1 md:px-2 md:text-sm">
          @{session.user.username || session.user.email}
        </p>
      </div>
      <div className="z-20 ml-auto flex flex-col gap-2 pl-2">
        <div className="hidden md:block">
          <ReactFlagsSelect
            selectButtonClassName="!bg-content2 !rounded-xl !border-none !text-foreground !py-1 !px-2 after:!content-none"
            className="!rounded-xl !border-none !bg-content2 !p-0 !text-background after:!content-none"
            selected={session.user.country || ""}
            onSelect={() => null}
            disabled
          />
        </div>
        {session.user.favouritePlayer ? (
          <h2 className="break-words text-xs font-semibold md:text-lg">
            Favourite Player: {session.user.favouritePlayer}
          </h2>
        ) : null}
      </div>
    </div>
  );
}
