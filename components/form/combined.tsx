"use client";

import LoadingDots from "@/components/icons/loading-dots";
import { cn } from "@/lib/utils";
import { useParams, useRouter } from "next/navigation";
import { useFormStatus } from "react-dom";
import { toast } from "sonner";
import DomainStatus from "./domain-status";
import DomainConfiguration from "./domain-configuration";
import va from "@vercel/analytics";
import { useSession } from "next-auth/react";
import Uploader from "../old-components/uploader";

interface InputAttr {
  name: string;
  type: string;
  defaultValue: string;
  placeholder?: string;
  maxLength?: number;
  pattern?: string;
  min?: string;
}
export default function CombinedForm({
  title,
  descriptions,
  helpText,
  inputAttrs,
  handleSubmit,
}: {
  title: String;
  descriptions: string[];
  helpText: string;
  inputAttrs: InputAttr[];
  handleSubmit: any;
}) {
  const { id } = useParams() as { id?: string };
  const router = useRouter();
  const { update } = useSession();

  return (
    <form
      action={async (data: FormData) => {
        await Promise.all(
          inputAttrs.map((inputAttr) =>
            handleSubmit(data, id, inputAttr.name).then(async (res: any) => {
              if (res.error) {
                toast.error(res.error);
              } else {
                va.track(`Updated ${inputAttr.name}`, id ? { id } : {});
              }
            }),
          ),
        );
        toast.success(`Successfully updated ${title}!`);
      }}
      className="rounded-lg border border-stone-200 bg-white dark:border-stone-700 dark:bg-black"
    >
      <h2 className=" p-5 pb-0 font-cal text-xl dark:text-white">{title}</h2>
      <div className="flex w-full flex-wrap">
        {inputAttrs.map((inputAttr, index) => (
          <div
            className="relative flex w-1/2 flex-col space-y-4 p-5"
            key={index + "reward-editor"}
          >
            <p className="text-sm text-stone-500 dark:text-stone-200">
              {descriptions[index]}
            </p>
            {inputAttr.name === "font" ? (
              <div className="flex max-w-sm items-center overflow-hidden rounded-lg border border-stone-600">
                <select
                  name="font"
                  defaultValue={inputAttr.defaultValue}
                  className="w-full rounded-none border-none bg-white px-4 py-2 text-sm font-medium text-stone-700 focus:outline-none focus:ring-black dark:bg-black dark:text-stone-200 dark:focus:ring-white"
                >
                  <option value="font-cal">Cal Sans</option>
                  <option value="font-lora">Lora</option>
                  <option value="font-work">Work Sans</option>
                </select>
              </div>
            ) : inputAttr.name === "color1" ||
              inputAttr.name === "color2" ||
              inputAttr.name === "color3" ? (
              <input
                {...inputAttr}
                type="color"
                className="h-12 w-12 rounded-md border border-stone-300 text-sm text-stone-900 placeholder-stone-300 focus:border-stone-500 focus:outline-none focus:ring-stone-500 dark:border-stone-600 dark:bg-black dark:text-white dark:placeholder-stone-700"
              />
            ) : inputAttr.name === "subdomain" ? (
              <div className="flex w-full max-w-md">
                <input
                  {...inputAttr}
                  required
                  className="z-10 flex-1 rounded-l-md border border-stone-300 text-sm text-stone-900 placeholder-stone-300 focus:border-stone-500 focus:outline-none focus:ring-stone-500 dark:border-stone-600 dark:bg-black dark:text-white dark:placeholder-stone-700"
                />
                <div className="flex items-center rounded-r-md border border-l-0 border-stone-300 bg-stone-100 px-3 text-sm dark:border-stone-600 dark:bg-stone-800 dark:text-stone-400">
                  {process.env.NEXT_PUBLIC_ROOT_DOMAIN}
                </div>
              </div>
            ) : inputAttr.name === "customDomain" ? (
              <div className="relative flex w-full max-w-md">
                <input
                  {...inputAttr}
                  className="z-10 flex-1 rounded-md border border-stone-300 text-sm text-stone-900 placeholder-stone-300 focus:border-stone-500 focus:outline-none focus:ring-stone-500 dark:border-stone-600 dark:bg-black dark:text-white dark:placeholder-stone-700"
                />
                {inputAttr.defaultValue && (
                  <div className="absolute right-3 z-10 flex h-full items-center">
                    <DomainStatus domain={inputAttr.defaultValue} />
                  </div>
                )}
              </div>
            ) : inputAttr.name === "description" ? (
              <textarea
                {...inputAttr}
                rows={3}
                required
                className="w-full max-w-xl rounded-md border border-stone-300 text-sm text-stone-900 placeholder-stone-300 focus:border-stone-500 focus:outline-none focus:ring-stone-500 dark:border-stone-600 dark:bg-black dark:text-white dark:placeholder-stone-700"
              />
            ) : inputAttr.name === "date" ? (
              <input
                {...inputAttr}
                type="date"
                required
                className="w-full max-w-md rounded-md border border-stone-300 text-sm text-stone-900 placeholder-stone-300 focus:border-stone-500 focus:outline-none focus:ring-stone-500 dark:border-stone-600 dark:bg-black dark:text-white dark:placeholder-stone-700"
              />
            ) : (
              <input
                {...inputAttr}
                required
                className="w-full max-w-md rounded-md border border-stone-300 text-sm text-stone-900 placeholder-stone-300 focus:border-stone-500 focus:outline-none focus:ring-stone-500 dark:border-stone-600 dark:bg-black dark:text-white dark:placeholder-stone-700"
              />
            )}
          </div>
        ))}
      </div>
      <div className="flex flex-col items-center justify-center space-y-2 rounded-b-lg border-t border-stone-200 bg-stone-50 p-3 sm:flex-row sm:justify-between sm:space-y-0 sm:px-10 dark:border-stone-700 dark:bg-stone-800">
        <p className="text-sm text-stone-500 dark:text-stone-400">{helpText}</p>
        <FormButton />
      </div>
    </form>
  );
}

function FormButton() {
  const { pending } = useFormStatus();
  return (
    <button
      className={cn(
        "flex h-8 w-32 items-center justify-center space-x-2 rounded-md border text-sm transition-all focus:outline-none sm:h-10",
        pending
          ? "cursor-not-allowed border-stone-200 bg-stone-100 text-stone-400 dark:border-stone-700 dark:bg-stone-800 dark:text-stone-300"
          : "border-black bg-black text-white hover:bg-white hover:text-black dark:border-stone-700 dark:hover:border-stone-200 dark:hover:bg-black dark:hover:text-white dark:active:bg-stone-800",
      )}
      disabled={pending}
    >
      {pending ? <LoadingDots color="#808080" /> : <p>Save Changes</p>}
    </button>
  );
}
