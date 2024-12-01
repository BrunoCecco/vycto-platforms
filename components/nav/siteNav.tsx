"use client";

import Link from "next/link";
import { Menu, Settings, Home, Book, Crown, Bell, Flag } from "lucide-react";
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
import { toast } from "sonner";
import { CoolMode } from "@/components/ui/coolMode";
import { ModalBody, Modal, ModalContent } from "../ui/animatedModal";
import { Story } from "../fanzone/story";
import HoverBorderGradient from "../ui/hoverBorderGradient";
import Input from "../input";

export default function SiteNav({
  data,
  latestCompetitionUrl,
  session,
  children,
}: {
  data: SelectSite;
  latestCompetitionUrl: string;
  session: any;
  children?: ReactNode;
}) {
  const segments = useSelectedLayoutSegments();
  const { id } = useParams() as { id?: string };

  const [isOpen, setIsOpen] = useState(false);
  const [email, setEmail] = useState("");

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
        name: "My Competitions",
        href: "/mycompetitions",
        isActive: segments[0] === "mycompetitions",
        icon: <Flag width={18} />,
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

  const subscribe = async () => {
    fetch("/api/subscribe", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        email: session?.user?.email || email,
        group: data.senderGroup,
      }),
    })
      .then(async (res) => {
        if (res.status === 200) {
          toast.success("Successfully subscribed to notifications!");
        }
        setIsOpen(false);
      })
      .catch((err) => {
        console.log(err);
        toast.error("Failed to subscribe to notifications!");
      });
  };

  const stayNotified = async () => {
    setIsOpen(true);
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
        } bg-content2 fixed top-0 z-10 flex h-full flex-col justify-between overflow-hidden border-r p-4 transition-all duration-200 sm:w-1/5 sm:translate-x-0`}
        style={{ borderColor: data.color1 }}
      >
        <div className="flex h-full flex-col justify-between">
          <div className="flex flex-col gap-4 px-2 py-2">
            <div className="hidden items-center justify-between gap-2 sm:flex">
              <Link href="/">
                <Image
                  src={data.logo || "/logo.png"}
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
                    isActive ? "bg-content3" : ""
                  } hover:bg-content3 active:bg-content3 rounded-lg px-2 py-1.5  transition-all duration-150 ease-in-out`}
                >
                  {icon}
                  <span className="text-sm font-medium">{name}</span>
                </Link>
              ))}
              <CoolMode>
                <div
                  onClick={stayNotified}
                  className={`hover:bg-content3 mt-12 flex cursor-pointer items-center space-x-3 rounded-lg px-2 py-1.5 transition-all  duration-150 ease-in-out `}
                >
                  <Bell width={18} />
                  <span className="text-sm font-medium">Stay Notified</span>
                </div>
              </CoolMode>
            </div>
          </div>
          <div className="mb-2">
            <div className="mb-1 font-semibold tracking-wide">POWERED BY</div>
            <Image
              src={"/vyctoLogoWhite.png"}
              alt="Vycto Logo"
              width={80}
              height={60}
              className="hidden dark:block"
            />
            <Image
              src={"/vyctoLogoBlue.png"}
              alt="Vycto Logo Dark"
              width={80}
              height={60}
              className="block dark:hidden"
            />
          </div>
        </div>
        <div>
          <div className="my-2 border-t border-stone-700" />
          {children}
        </div>
      </div>
      <Modal isOpen={isOpen} setIsOpen={setIsOpen}>
        <ModalBody>
          <ModalContent>
            <div className="flex flex-col items-center justify-center gap-4">
              <Story siteData={data} />
              {session ? (
                <button onClick={subscribe}>
                  <HoverBorderGradient
                    containerClassName="py-2 px-8"
                    className="flex items-center gap-2"
                  >
                    Stay Notified
                    <Bell width={18} />
                  </HoverBorderGradient>
                </button>
              ) : (
                <div className="flex w-[400px] flex-col items-center gap-2">
                  <input
                    type="text"
                    placeholder="hi@vycto.com"
                    className="relative z-10 my-4 w-full rounded-lg border  border-neutral-800 bg-neutral-950  placeholder:text-neutral-700  focus:ring-2 focus:ring-gray-300"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />{" "}
                  <button onClick={subscribe}>
                    <HoverBorderGradient
                      containerClassName="py-2 px-8"
                      className="flex items-center gap-2"
                    >
                      Stay Notified
                      <Bell width={18} />
                    </HoverBorderGradient>
                  </button>
                </div>
              )}
            </div>
          </ModalContent>
        </ModalBody>
      </Modal>
    </>
  );
}
