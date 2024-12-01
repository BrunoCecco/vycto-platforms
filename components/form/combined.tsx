"use client";

import LoadingDots from "@/components/icons/loadingDots";
import { cn } from "@/lib/utils";
import { useParams, useRouter } from "next/navigation";
import { toast } from "sonner";
import DomainStatus from "./domainStatus";
import DomainConfiguration from "./domainConfiguration";
import va from "@vercel/analytics";
import { useSession } from "next-auth/react";
import Uploader from "./uploader";
import Button from "../buttons/button";
import CountryPicker from "../settings/countryPicker";
import { Select, SelectItem, TextInput } from "@tremor/react";
import { USER_ROLES } from "@/lib/constants";
import ReactFlagsSelect from "react-flags-select";
import { useState } from "react";
import Image from "next/image";
import { PencilIcon } from "lucide-react";
import EditProfileImage from "../settings/editProfileImage";
import { useFormStatus } from "react-dom";

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
  className,
  hasImage = false,
  updateId,
}: {
  title: String;
  descriptions: string[];
  helpText: string;
  inputAttrs: InputAttr[];
  handleSubmit: any;
  className?: string;
  hasImage?: boolean;
  updateId?: string;
}) {
  const { id } = useParams() as { id?: string };
  const router = useRouter();
  const { update } = useSession();
  const [selectedCountry, setSelectedCountry] = useState(
    inputAttrs.find((inputAttr) => inputAttr.name === "country")?.defaultValue,
  );

  const imageInputAttr = inputAttrs.find((inputAttr) =>
    inputAttr.type.includes("image"),
  );

  const ImageInput = () => {
    if (!imageInputAttr) return null;
    return (
      <div className="w-full pl-5 pt-5 sm:w-1/3">
        <Uploader
          name={imageInputAttr?.name!}
          id={imageInputAttr?.name || ""}
          title={""}
          description={""}
          defaultValue={imageInputAttr?.defaultValue || ""}
          upload={(name: string, value: string) => {
            const formData = new FormData();
            // append input as file type to form data
            formData.append(name, value);
            handleSubmit(formData, updateId || id, name).then(
              async (res: any) => {
                if (res.error) {
                  toast.error(res.error);
                } else {
                  va.track(`Updated ${name}`, id ? { id } : {});
                  toast.success(`Successfully updated ${name}!`);
                }
              },
            );
          }}
        />
      </div>
    );
  };

  return (
    <div className="rounded-lg border border-stone-200 bg-white dark:border-stone-700 dark:bg-black">
      <h2 className="p-5 text-xl text-black dark:text-white">{title}</h2>
      <div className="flex flex-col sm:flex-row">
        {hasImage && ( //hasImage means hasProfileImage
          <div className="w-full pl-5 pt-5 sm:w-1/3">
            <EditProfileImage />
          </div>
        )}
        {ImageInput()}
        <form
          action={async (data: FormData) => {
            const res = await Promise.all(
              inputAttrs.map((inputAttr) =>
                handleSubmit(data, updateId || id, inputAttr.name).then(
                  async (res: any) => {
                    if (res.error) {
                      toast.error(res.error);
                    } else {
                      va.track(`Updated ${inputAttr.name}`, id ? { id } : {});
                    }
                  },
                ),
              ),
            );
            toast.success(`Successfully updated ${title}!`);
          }}
          className="flex-1"
        >
          {inputAttrs.map((inputAttr, index) => {
            return (
              <div
                className="relative flex w-full flex-col space-y-2 px-5 pt-5"
                key={index + "reward-editor"}
              >
                <p className="text-sm text-stone-500 dark:text-stone-200">
                  {descriptions[index]}
                </p>
                {inputAttr.name.includes("image") ? null : inputAttr.name ===
                  "country" ? (
                  <>
                    <input
                      type="hidden"
                      name="country"
                      value={selectedCountry}
                    />
                    <ReactFlagsSelect
                      selectButtonClassName="w-full rounded-md border border-stone-300 text-sm text-stone-900 placeholder-stone-300 focus:border-stone-500 focus:outline-none focus:ring-stone-500 dark:border-stone-600 dark:bg-black dark:text-white dark:placeholder-stone-700"
                      className="text-black"
                      selected={selectedCountry || ""}
                      onSelect={(code) => setSelectedCountry(code)}
                    />
                  </>
                ) : inputAttr.name === "role" ? (
                  <div className="w-full rounded-md border border-stone-300 text-sm text-stone-900 placeholder-stone-300 focus:border-stone-500 focus:outline-none focus:ring-stone-500 dark:border-stone-600 dark:bg-black dark:text-white dark:placeholder-stone-700">
                    <Select name="role" defaultValue={inputAttr.defaultValue}>
                      {USER_ROLES.map((role) => (
                        <SelectItem key={role} value={role}>
                          {role}
                        </SelectItem>
                      ))}
                    </Select>
                  </div>
                ) : inputAttr.name === "font" ? (
                  <div className="w-full rounded-md border border-stone-300 text-sm text-stone-900 placeholder-stone-300 focus:border-stone-500 focus:outline-none focus:ring-stone-500 dark:border-stone-600 dark:bg-black dark:text-white dark:placeholder-stone-700">
                    <Select name="font" defaultValue={inputAttr.defaultValue}>
                      <SelectItem value="font-cal">Cal Sans</SelectItem>
                      <SelectItem value="font-lora">Lora</SelectItem>
                      <SelectItem value="font-work">Work Sans</SelectItem>
                    </Select>
                  </div>
                ) : inputAttr.name === "color1" ||
                  inputAttr.name === "color2" ||
                  inputAttr.name === "color3" ? (
                  <input
                    {...inputAttr}
                    type="color"
                    className="h-12 w-12 text-sm text-stone-900 placeholder-stone-300 focus:border-stone-500 focus:outline-none focus:ring-stone-500 dark:border-stone-600 dark:bg-black dark:text-white dark:placeholder-stone-700"
                  />
                ) : inputAttr.name === "subdomain" ? (
                  <div className="flex w-full">
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
                  <div className="relative flex w-full">
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
                    className="w-full rounded-md border border-stone-300 text-sm text-stone-900 placeholder-stone-300 focus:border-stone-500 focus:outline-none focus:ring-stone-500 dark:border-stone-600 dark:bg-black dark:text-white dark:placeholder-stone-700"
                  />
                ) : inputAttr.name.includes("date") ? (
                  <input
                    {...inputAttr}
                    type="date"
                    required
                    className="w-full rounded-md border border-stone-300 text-sm text-stone-900 placeholder-stone-300 focus:border-stone-500 focus:outline-none focus:ring-stone-500 dark:border-stone-600 dark:bg-black dark:text-white dark:placeholder-stone-700"
                  />
                ) : (
                  <input
                    {...inputAttr}
                    required
                    className="w-full rounded-md border border-stone-300 text-sm text-stone-900 placeholder-stone-300 focus:border-stone-500 focus:outline-none focus:ring-stone-500 dark:border-stone-600 dark:bg-black dark:text-white dark:placeholder-stone-700"
                  />
                )}
              </div>
            );
          })}
          {!hasImage ? (
            <div className="mt-4 flex flex-col items-center justify-center space-y-2 rounded-b-lg border-t border-stone-200 bg-stone-50 p-3 dark:border-stone-700 dark:bg-stone-800 sm:flex-row sm:justify-between sm:space-y-0 sm:px-10">
              <p className="mr-2 text-sm text-stone-500 dark:text-stone-400">
                helpText
              </p>
              <FormButton />
            </div>
          ) : (
            <div className="mt-4 flex flex-col items-center justify-end space-y-2 p-3 sm:space-y-0 sm:px-10">
              <FormButton />
            </div>
          )}
        </form>
      </div>
    </div>
  );
}

const FormButton = () => {
  const { pending } = useFormStatus();

  return (
    <Button disabled={pending} loading={pending ? 1 : 0}>
      <p>Save Changes</p>
    </Button>
  );
};
