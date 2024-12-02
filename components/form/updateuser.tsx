"use client";

import LoadingDots from "@/components/icons/loadingDots";
import { cn } from "@/lib/utils";
import { useParams, useRouter } from "next/navigation";
import { useFormStatus } from "react-dom";
import { toast } from "sonner";
import DomainStatus from "./domainStatus";
import DomainConfiguration from "./domainConfiguration";
import va from "@vercel/analytics";
import { useSession } from "next-auth/react";
import Uploader from "./uploader";
import { USER_ROLES } from "@/lib/constants";
import { useRef } from "react";
import { Button, Select, SelectItem } from "@nextui-org/react";
import { Check } from "lucide-react";

export default function UserForm({
  inputAttrs,
  userId,
  handleSubmit,
  children,
}: {
  inputAttrs: {
    name: string;
    type: string;
    defaultValue: string;
    placeholder?: string;
    maxLength?: number;
    pattern?: string;
  };
  userId: string;
  handleSubmit: any;
  children?: React.ReactNode;
}) {
  const formRef = useRef<HTMLFormElement>(null);

  return (
    <form
      ref={formRef}
      action={async (data: FormData) => {
        handleSubmit(data, userId, inputAttrs.name).then(async (res: any) => {
          if (res.error) {
            toast.error(res.error);
          } else {
            toast.success(`Successfully updated ${inputAttrs.name}!`);
          }
        });
      }}
      className="flex w-max items-center gap-2 rounded-lg"
    >
      {inputAttrs.name === "role" ? (
        <Select
          name="role"
          aria-label="role"
          placeholder={inputAttrs.defaultValue}
          defaultSelectedKeys={[inputAttrs.defaultValue]}
          className="w-40"
        >
          {USER_ROLES.map((role) => (
            <SelectItem key={role}>{role}</SelectItem>
          ))}
        </Select>
      ) : null}
      <Button type="submit" className="w-32">
        <Check />
      </Button>
    </form>
  );
}
