"use client";

import {
  calculateCompetitionPoints,
  deleteCompetition,
  duplicateCompetition,
  updateCompetitionMetadata,
  updateUserCompetitionStats,
} from "@/lib/actions";
import { SelectCompetition } from "@/lib/schema";
import { useEffect, useState, useTransition } from "react";
import { toast } from "sonner";
import LoadingDots from "../icons/loadingDots";
import { cn } from "@/lib/utils";
import { validateCorrectAnswers } from "@/lib/fetchers";
import Form from "../form";
import { Spinner } from "@nextui-org/react";
import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Button,
} from "@nextui-org/react";
import { CircleEllipsis } from "lucide-react";

export default function DuplicateButton({
  competition,
}: {
  competition: SelectCompetition & { site: any };
}) {
  let [isPendingPublishing, startTransitionPublishing] = useTransition();

  const items = [
    {
      key: "duplicate",
      label: "Duplicate Competition",
    },
    {
      key: "delete",
      label: "Delete Competition",
    },
  ];

  const handleDuplicate = () => {
    startTransitionPublishing(async () => {
      await duplicateCompetition(competition.id).then(() => {
        toast.success(`Successfully duplicated your competition.`);
      });
    });
  };

  const handleDelete = () => {
    if (window.confirm("Are you sure you want to delete your competition?")) {
      const data = new FormData();
      startTransitionPublishing(async () => {
        deleteCompetition(data, competition.id, "delete").then((res) => {
          if (res.error) {
            toast.error(res.error);
          } else {
            toast.success(`Successfully deleted competition!`);
          }
        });
      });
    }
  };

  return (
    <Dropdown>
      <DropdownTrigger>
        <CircleEllipsis className="cursor-pointer" />
      </DropdownTrigger>
      <DropdownMenu aria-label="Dynamic Actions" items={items}>
        {(item) => (
          <DropdownItem
            key={item.key}
            className={item.key === "delete" ? "text-danger" : ""}
            color={item.key === "delete" ? "danger" : "default"}
            onClick={item.key === "duplicate" ? handleDuplicate : handleDelete}
          >
            {item.label}
            {item.key === "duplicate" && isPendingPublishing && <Spinner />}
          </DropdownItem>
        )}
      </DropdownMenu>
    </Dropdown>
  );
}
