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
  Table2,
  Crown,
  Camera,
} from "lucide-react";
import {
  useParams,
  usePathname,
  useSelectedLayoutSegments,
} from "next/navigation";
import { ReactNode, useEffect, useMemo, useState } from "react";
import { getSiteFromCompetitionId } from "@/lib/actions";
import Image from "next/image";
import { Button } from "@nextui-org/react";

export default function Nav({
  isSuperAdmin = false,
  children,
}: {
  isSuperAdmin?: boolean;
  children: ReactNode;
}) {
  const segments = useSelectedLayoutSegments();
  const { id } = useParams() as { id?: string };

  const [siteId, setSiteId] = useState<string | null>();

  useEffect(() => {
    if (segments[0] === "competition" && id) {
      getSiteFromCompetitionId(id).then((id) => {
        setSiteId(id);
      });
    }
  }, [id]);

  const tabs = useMemo(() => {
    if (segments[0] === "site" && id) {
      return [
        {
          name: "Back to All Playgrounds",
          href: "/sites",
          icon: <ArrowLeft width={18} />,
        },
        {
          name: "Competitions",
          href: `/site/${id}`,
          isActive: segments.length === 2,
          icon: <Newspaper width={18} />,
        },
        {
          name: "Rewards",
          href: `/site/${id}/rewards`,
          isActive: segments.includes("rewards"),
          icon: <Crown width={18} />,
        },
        {
          name: "Analytics",
          href: `/site/${id}/analytics`,
          isActive: segments.includes("analytics"),
          icon: <BarChart3 width={18} />,
        },
        {
          name: "Settings",
          href: `/site/${id}/settings`,
          isActive: segments.includes("settings"),
          icon: <Settings width={18} />,
        },
      ];
    } else if (segments[0] === "competition" && id) {
      return [
        {
          name: "Back to All Competitions",
          href: siteId ? `/site/${siteId}` : "/sites",
          icon: <ArrowLeft width={18} />,
        },
        {
          name: "Create",
          href: `/competition/${id}`,
          isActive: segments.length === 2,
          icon: <Wand width={18} />,
        },
        {
          name: "Editor",
          href: `/competition/${id}/editor`,
          isActive: segments.includes("editor"),
          icon: <Edit3 width={18} />,
        },
        {
          name: "Rewards",
          href: `/competition/${id}/rewards`,
          isActive: segments.includes("rewards"),
          icon: <Gift width={18} />,
        },
        {
          name: "Media",
          href: `/competition/${id}/media`,
          isActive: segments.includes("media"),
          icon: <Camera width={18} />,
        },
        {
          name: "Settings",
          href: `/competition/${id}/settings`,
          isActive: segments.includes("settings"),
          icon: <Settings width={18} />,
        },
        {
          name: "Results",
          href: `/competition/${id}/results`,
          isActive: segments.includes("results"),
          icon: <Trophy width={18} />,
        },
      ];
    }
    return [
      {
        name: "Overview",
        href: "/",
        isActive: segments.length === 0,
        icon: <LayoutDashboard width={18} />,
      },
      {
        name: "Sites",
        href: "/sites",
        isActive: segments[0] === "sites",
        icon: <Globe width={18} />,
      },
      {
        name: "Settings",
        href: "/settings",
        isActive: segments[0] === "settings",
        icon: <Settings width={18} />,
      },
      {
        name: isSuperAdmin ? "Admin Panel" : "",
        href: isSuperAdmin ? `/admin` : "",
        isActive: segments.includes("admin"),
        icon: <Table2 width={18} />,
      },
    ];
  }, [segments, id, siteId]);

  const [showSidebar, setShowSidebar] = useState(false);

  const pathname = usePathname();

  useEffect(() => {
    // hide sidebar on path change
    setShowSidebar(false);
  }, [pathname]);

  return (
    <>
      <Button
        className={`fixed z-50 ${
          // left align for Editor, right align for other pages
          segments[0] === "competition" && segments.length === 2 && !showSidebar
            ? "left-5 top-5"
            : "right-5 top-7"
        } sm:hidden `}
        onClick={() => setShowSidebar(!showSidebar)}
      >
        <Menu width={20} className="" />
      </Button>
      <div
        className={`transform ${
          showSidebar ? "w-full translate-x-0" : "-translate-x-full"
        } fixed z-40 flex h-full flex-col justify-between border-r bg-content2 p-4 transition-all sm:w-80 sm:translate-x-0`}
      >
        <div className="grid gap-2">
          <div className="flex items-center space-x-2 rounded-lg px-2 py-1.5">
            <Link href="/" className="rounded-lg  p-2 ">
              <Image
                src="/logo.png"
                width={36}
                height={36}
                alt="Logo"
                className="dark:scale-110 dark:rounded-full dark:border "
              />
            </Link>
          </div>
          <div className="grid gap-1">
            {tabs.map(({ name, href, isActive, icon }) => (
              <Link
                key={name}
                href={href}
                className={`flex items-center space-x-3 ${
                  isActive ? "bg-content3" : ""
                } rounded-lg px-2 py-1.5 transition-all duration-150 ease-in-out hover:bg-content3 active:bg-content3`}
              >
                {icon}
                <span className="text-sm font-medium">{name}</span>
              </Link>
            ))}
          </div>
        </div>
        <div>
          <div className="my-2 border-t  " />
          {children}
        </div>
      </div>
    </>
  );
}
