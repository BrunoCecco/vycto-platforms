"use client";

import Link from "next/link";
import {
  ArrowLeft,
  BarChart3,
  Edit3,
  Globe,
  Layout,
  LayoutDashboard,
  Megaphone,
  Menu,
  Newspaper,
  Settings,
  FileCode,
  Github,
  Gift,
  Wand,
  Trophy,
  Home,
  Book,
  Crown,
  Bell,
} from "lucide-react";
import {
  useParams,
  usePathname,
  useSelectedLayoutSegments,
} from "next/navigation";
import { ReactNode, useEffect, useMemo, useState } from "react";
import { getSiteFromCompetitionId } from "@/lib/actions";
import Image from "next/image";
import { SelectSite } from "@/lib/schema";
import PlayButton from "../buttons/playButton";
import { Button } from "@tremor/react";
import { toast } from "sonner";

export default function SiteNav({
  data,
  latestCompetitionUrl,
  children,
}: {
  data: SelectSite;
  latestCompetitionUrl: string;
  children?: ReactNode;
}) {
  const segments = useSelectedLayoutSegments();
  const { id } = useParams() as { id?: string };
  const [hovered, setHovered] = useState(false);

  const tabs = useMemo(() => {
    return [
      {
        name: "Home",
        href: "/",
        isActive: segments.length === 0,
        icon: <Home width={18} />,
      },
      {
        name: "How To Play",
        href: "/howtoplay",
        isActive: segments[0] === "howtoplay",
        icon: <Book width={18} />,
      },
      {
        name: "My Rewards",
        href: "/rewards",
        isActive: segments[0] === "rewards",
        icon: <Crown width={18} />,
      },
      {
        name: "Settings",
        href: "/settings",
        isActive: segments[0] === "settings",
        icon: <Settings width={18} />,
      },
    ];
  }, [segments, id]);

  const [showSidebar, setShowSidebar] = useState(false);

  const pathname = usePathname();

  useEffect(() => {
    // hide sidebar on path change
    setShowSidebar(false);
  }, [pathname]);

  const stayNotified = () => {
    toast.success("Successfully subscribed to notifications!");
  };

  return (
    <>
      <button
        className={`relative z-20 rounded-md p-2 shadow-md hover:opacity-75 sm:hidden`}
        onClick={() => setShowSidebar(!showSidebar)}
      >
        <Menu width={20} className="text-stone-100" />
      </button>
      <div
        className={`transform ${
          showSidebar
            ? "w-[100vw] translate-x-0"
            : "w-[15vw] -translate-x-[15vw]"
        } fixed top-0 z-10 flex h-full flex-col justify-between overflow-hidden border-r border-stone-700 bg-stone-900 p-4 transition-all duration-200 sm:w-1/5 sm:translate-x-0`}
        style={{ borderColor: data.color1 }}
      >
        <div className="flex h-full flex-col justify-between">
          <div className="flex flex-col gap-4 px-2 py-2">
            <div className="hidden items-center justify-between gap-2 sm:flex">
              <Link href="/">
                <Image
                  src={data.logo ?? "/logo.png"}
                  alt="Logo"
                  width={60}
                  height={60}
                  className=""
                />
              </Link>
              <Link href={latestCompetitionUrl}>
                <PlayButton color1={data.color1} color2={data.color2}>
                  Play
                </PlayButton>
              </Link>
            </div>
            <div className="mt-4 grid gap-1">
              {tabs.map(({ name, href, isActive, icon }) => (
                <Link
                  key={name}
                  href={href}
                  className={`flex items-center space-x-3 ${
                    isActive ? "bg-stone-700" : ""
                  } rounded-lg px-2 py-1.5 text-white transition-all duration-150  ease-in-out hover:bg-stone-700 active:bg-stone-300 active:bg-stone-800`}
                >
                  {icon}
                  <span className="text-sm font-medium">{name}</span>
                </Link>
              ))}
              <div
                onClick={stayNotified}
                className={`mt-12 flex cursor-pointer items-center space-x-3 rounded-lg px-2 py-1.5 text-white transition-all duration-150  ease-in-out hover:bg-stone-700 `}
              >
                <Bell width={18} />
                <span className="text-sm font-medium">Stay Notified</span>
              </div>
            </div>
          </div>
          <div className="mb-2">
            <div className="mb-1 font-semibold tracking-wide text-white">
              POWERED BY
            </div>
            <Image
              src={"/vyctoLogoWhite.png"}
              alt="Vycto Logo"
              width={80}
              height={60}
              className=""
            />
          </div>
        </div>
        <div>
          <div className="my-2 border-t border-stone-700" />
          {children}
        </div>
      </div>
    </>
  );
}
