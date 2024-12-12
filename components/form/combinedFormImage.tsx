"use client";
import Form from "@/components/form";
import { editUser } from "@/lib/actions";
import Image from "next/image";
import { PencilIcon } from "lucide-react";
import { Session } from "next-auth";
import { useSession } from "next-auth/react";
import useUserSession from "@/lib/hooks/useUserSession";

export default function CombinedFormImage({
  name,
  image,
  handleSubmit,
  updateId,
  placeholder,
}: {
  name: string;
  image: string;
  handleSubmit: (data: FormData, _id: string, key: string) => Promise<void>;
  updateId?: string;
  placeholder?: string;
}) {
  return (
    <Form
      title=""
      description=""
      helpText=""
      inputAttrs={{
        name: name,
        type: "file",
        defaultValue: image,
        placeholder: placeholder,
      }}
      handleSubmit={handleSubmit}
      updateId={updateId}
      circular={true}
    />
  );
}
