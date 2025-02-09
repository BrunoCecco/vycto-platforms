"use client";
import React from "react";
import {
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalTrigger,
} from "@/components/ui/animatedModal";
import PlayButton from "@/components/buttons/playButton";
import Image from "next/image";
import { motion } from "framer-motion";
import { SelectCompetition, SelectSite } from "../../lib/schema";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Crown, Trophy, Rocket, Sparkle, Timer } from "lucide-react";
import { useTranslations } from "next-intl";

export default function CompetitionModal({
  type,
  siteData,
  competition,
  numQuestions,
  isOpen,
  setIsOpen,
  status,
  users,
}: {
  type: string;
  siteData: SelectSite;
  competition: SelectCompetition;
  numQuestions: number;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  status?: string;
  users?: any[];
}) {
  const t = useTranslations();
  const images = [
    competition?.image,
    competition?.image2 || siteData?.logo,
    competition?.image3 || "/logo.png",
    competition?.image4 || "/vLogo.png",
  ];

  return (
    competition && (
      <Modal isOpen={isOpen} setIsOpen={setIsOpen}>
        <ModalBody>
          <ModalContent>
            <h4 className="mb-8 text-center text-xl font-bold md:text-2xl">
              {type === "current" ? (
                <span>
                  A chance to{" "}
                  <span
                    className="rounded-lg px-2 py-1 text-background"
                    style={{ backgroundColor: siteData.color1 }}
                  >
                    WIN
                  </span>{" "}
                  your favourite {siteData.name} prizes
                </span>
              ) : (
                t("view") + " " + t("competition") + " " + t("results")
              )}
            </h4>
            <div className="mb-8 flex items-center justify-center">
              {images.map((image, idx) => (
                <motion.div
                  key={"images" + idx}
                  style={{
                    rotate: Math.random() * 20 - 10,
                  }}
                  whileHover={{
                    scale: 1.1,
                    rotate: 0,
                    zIndex: 100,
                  }}
                  whileTap={{
                    scale: 1.1,
                    rotate: 0,
                    zIndex: 100,
                  }}
                  className="-mr-4 mt-4 flex-shrink-0 overflow-hidden rounded-xl  p-1 "
                >
                  <Image
                    src={image || "/logo.png"}
                    alt="images"
                    width="500"
                    height="500"
                    className="h-28 w-28 flex-shrink-0 rounded-lg object-cover md:h-40 md:w-40"
                  />
                </motion.div>
              ))}
            </div>
            <div className="mx-auto grid max-w-md grid-cols-2 items-center gap-4 text-sm">
              {/* <span className="">{status}</span> */}
              <span className="flex items-center">
                <Sparkle className="mr-2" /> {competition.title}
              </span>
              <span className="flex items-center">
                <Timer className="mr-2" />{" "}
                {new Date(
                  competition.date.replace(/\[.*\]$/, ""),
                ).toDateString()}
              </span>
              {competition.rewardTitle && (
                <span className="flex items-center">
                  <Trophy className="mr-2" />
                  {competition.rewardTitle}
                </span>
              )}
              {competition.reward2Title && (
                <span className="flex items-center">
                  <Trophy className="mr-2" />
                  {competition.reward2Title}
                </span>
              )}
              <span className="flex items-center">
                <Rocket className="mr-2" /> {numQuestions} Questions
              </span>
              <span className="flex items-center">
                <Crown className="mr-2" />
                {(competition.rewardWinners || 0) +
                  (competition.reward2Winners || 0) +
                  (competition.reward3Winners || 0)}{" "}
                Winners
              </span>
            </div>
          </ModalContent>
          <ModalFooter className="gap-4">
            <Link href={"/comp/" + competition?.slug}>
              <PlayButton color1={siteData?.color1} color2={siteData?.color2}>
                {type === "current" ? t("letsgo") + "! →" : t("view") + " →"}
              </PlayButton>
            </Link>
          </ModalFooter>
        </ModalBody>
      </Modal>
    )
  );
}
