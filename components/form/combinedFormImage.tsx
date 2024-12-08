"use client";
import Form from "@/components/form";
import { editUser } from "@/lib/actions";
import Image from "next/image";
import { PencilIcon } from "lucide-react";
import { Session } from "next-auth";
import { useSession } from "next-auth/react";
import useUserSession from "@/lib/hooks/useUserSession";

export default function CombinedFormImage({
  image,
  handleSubmit,
  updateId,
}: {
  image: string;
  handleSubmit: (data: FormData, _id: string, key: string) => Promise<void>;
  updateId?: string;
}) {
  return (
    <Form
      title=""
      description=""
      helpText=""
      inputAttrs={{
        name: "image",
        type: "file",
        defaultValue: image,
        placeholder: "Image",
      }}
      handleSubmit={handleSubmit}
      updateId={updateId}
      circular={true}
    />
  );
}
