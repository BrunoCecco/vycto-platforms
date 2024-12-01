"use client";

import { useModal } from "@/components/modal/provider";
import { Button } from "@nextui-org/react";
import { ReactNode } from "react";

export default function CreateSiteButton({
  children,
}: {
  children: ReactNode;
}) {
  const modal = useModal();
  return <Button onClick={() => modal?.show(children)}>Create New Site</Button>;
}
