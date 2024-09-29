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

export default function SelectForm({
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
      className="rounded-lg border border-stone-200 bg-white dark:border-stone-700 dark:bg-black"
    >
      {inputAttrs.name === "role" ? (
        <div className="flex max-w-sm items-center overflow-hidden rounded-lg border border-stone-600">
          <select
            name="role"
            defaultValue={inputAttrs.defaultValue}
            className="w-full rounded-none border-none bg-white px-4 py-2 text-sm font-medium text-stone-700 focus:outline-none focus:ring-black dark:bg-black dark:text-stone-200 dark:focus:ring-white"
            onChange={() => formRef.current?.requestSubmit()}
          >
            {USER_ROLES.map((role) => (
              <option key={role} value={role}>
                {role}
              </option>
            ))}
          </select>
        </div>
      ) : null}
    </form>
  );
}
