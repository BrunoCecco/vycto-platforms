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

export default function CompetitionModal({
  type,
  siteData,
  competition,
  onClose,
  status,
  users,
}: {
  type: string;
  siteData: SelectSite;
  competition: SelectCompetition;
  onClose: () => void;
  status?: string;
  users?: any[];
}) {
  const images = [
    siteData.logo,
    competition.image,
    competition.rewardImage,
    competition.reward2Image,
  ];
  return (
    <Modal isOpen={true} onClose={onClose}>
      <ModalBody>
        <ModalContent>
          <h4 className="mb-8 text-center text-lg font-bold text-neutral-600 md:text-2xl dark:text-neutral-100">
            {type === "current"
              ? "Ready to win big prizes? 👀"
              : "View competition results"}
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
                className="-mr-4 mt-4 flex-shrink-0 overflow-hidden rounded-xl border border-neutral-100 bg-white p-1 dark:border-neutral-700 dark:bg-neutral-800"
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
          <div className="mx-auto flex max-w-sm flex-col items-center gap-4">
            <div className="flex items-center justify-center">
              <span className="text-sm text-neutral-700 dark:text-neutral-300">
                {status}
              </span>
            </div>
          </div>
        </ModalContent>
        <ModalFooter className="gap-4">
          <Link href={"/comp/" + competition.slug}>
            <PlayButton color1={siteData.color1} color2={siteData.color2}>
              {type === "current" ? "Let's Go →" : "View →"}
            </PlayButton>
          </Link>
        </ModalFooter>
      </ModalBody>
    </Modal>
  );
}
