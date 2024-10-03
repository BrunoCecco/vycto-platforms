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
import { capitalize } from "@/lib/utils";

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

  const tabs = useMemo(() => {
    return [
      {
        name: "Home",
        href: "/",
        isActive: segments[0] === "",
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

  const addFanzoneToString = (str: string) => {
    if (str?.includes("fanzone")) return str;
    return str + " FANZONE";
  };

  return (
    <>
      <button
        className={`z-20 rounded-md bg-white p-2 shadow-md hover:opacity-75 sm:hidden`}
        onClick={() => setShowSidebar(!showSidebar)}
      >
        <Menu width={20} className="dark:text-white" />
      </button>
      <div
        className={`transform ${
          showSidebar ? "w-[100vw] translate-x-0" : "w-[15vw] translate-x-0"
        } fixed z-10 flex h-full flex-col justify-between border-r border-stone-200 bg-stone-100 p-4 transition-all duration-200 sm:w-1/5 2xl:w-[10vw] 2xl:translate-x-[90vw] dark:border-stone-700 dark:bg-stone-900`}
      >
        <div className="grid gap-2">
          <div className="hidden flex-col gap-2 px-2 py-2 sm:flex">
            <div className="flex items-center justify-between gap-2">
              <Link href="/">
                <Image
                  src={data.logo ?? "/logo.png"}
                  alt="Logo"
                  width={80}
                  height={80}
                  className=""
                />
              </Link>
              <Link
                className={`rounded-full px-8 py-2 font-semibold text-white shadow-sm shadow-gray-600 transition-all duration-200 hover:shadow-none`}
                style={{
                  backgroundImage: `linear-gradient(45deg, ${data.color2}, ${data.color1})`,
                }}
                href={latestCompetitionUrl}
              >
                Play
              </Link>
            </div>

            <div className="text-2xl font-bold">
              {capitalize(addFanzoneToString(data.name || ""))}
            </div>
          </div>
          <div className="grid gap-1">
            {tabs.map(({ name, href, isActive, icon }) => (
              <Link
                key={name}
                href={href}
                className={`flex items-center space-x-3 ${
                  isActive ? "bg-stone-200 text-black dark:bg-stone-700" : ""
                } rounded-lg px-2 py-1.5 transition-all duration-150 ease-in-out hover:bg-stone-200 active:bg-stone-300 dark:text-white dark:hover:bg-stone-700 dark:active:bg-stone-800`}
              >
                {icon}
                <span className="text-sm font-medium">{name}</span>
              </Link>
            ))}
          </div>
        </div>
        <div>
          <div className="my-2 border-t border-stone-200 dark:border-stone-700" />
          {children}
        </div>
      </div>
    </>
  );
}
