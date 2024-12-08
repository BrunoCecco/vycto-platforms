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
import {
  SelectCompetition,
  SelectSite,
  SelectSiteReward,
} from "../../lib/schema";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Crown, Trophy, Rocket, Sparkle, Timer } from "lucide-react";
import { MONTHS } from "@/lib/constants";

export default function RewardModal({
  reward,
  siteData,
  isOpen,
  setIsOpen,
}: {
  reward?: SelectSiteReward;
  siteData: SelectSite;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}) {
  const images = [
    reward?.image1 || reward?.image,
    reward?.image2 || siteData?.logo,
    reward?.image3 || "/logo.png",
    reward?.image4 || "/vLogo.png",
  ];

  return (
    reward && (
      <Modal isOpen={isOpen} setIsOpen={setIsOpen}>
        <ModalBody>
          <ModalContent>
            <h4 className="mb-8 text-center text-lg font-bold md:text-2xl">
              {MONTHS.find((m) => m.value === reward.month)?.label} Challenge
            </h4>
            <div className="mb-8 flex items-center justify-center">
              {" "}
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
                    className="h-20 w-20 flex-shrink-0 rounded-lg object-cover md:h-40 md:w-40"
                  />
                </motion.div>
              ))}
            </div>
            <div className="mx-auto grid max-w-md grid-cols-2 items-center gap-4 text-sm">
              <span className="flex items-center">
                <Sparkle className="mr-2" /> {reward.title}
              </span>
              <span className="flex items-center">
                <Timer className="mr-2" />{" "}
                {MONTHS.find((m) => m.value === reward.month)?.label}
              </span>
              <span className="flex items-center">
                <Rocket className="mr-2" />
                {reward.sponsor || siteData.name}
              </span>
              <span className="flex items-center">
                <Crown className="mr-2" />
                {reward.rewardWinners || 1} Winner
                {reward.rewardWinners && reward.rewardWinners > 1 ? "s" : ""}
              </span>
            </div>
            <span className="mx-auto mt-4 max-w-xs text-center text-xs">
              {reward.description}
            </span>
          </ModalContent>
        </ModalBody>
      </Modal>
    )
  );
}
