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
import CountryPicker from "../settings/countryPicker";
import {
  Select,
  SelectItem,
  Button,
  Input,
  Textarea,
  Spinner,
} from "@nextui-org/react";
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
    <div className="borde rounded-lg">
      <h2 className="p-5 text-xl">{title}</h2>
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
                <p className="text-sm  ">{descriptions[index]}</p>
                {inputAttr.name.includes("image") ? null : inputAttr.name ===
                  "country" ? (
                  <>
                    <input
                      type="hidden"
                      hidden
                      name="country"
                      value={selectedCountry}
                    />
                    <ReactFlagsSelect
                      selectButtonClassName="!bg-content2 !rounded-xl !border-none !text-foreground !py-1 !px-2"
                      className="!rounded-xl !border-none !p-0 !text-black"
                      selected={selectedCountry || ""}
                      onSelect={(code) => setSelectedCountry(code)}
                    />
                  </>
                ) : inputAttr.name === "role" ? (
                  <Select
                    aria-label="role"
                    name="role"
                    defaultSelectedKeys={[inputAttr.defaultValue]}
                  >
                    {USER_ROLES.map((role) => (
                      <SelectItem key={role} value={role}>
                        {role}
                      </SelectItem>
                    ))}
                  </Select>
                ) : inputAttr.name === "font" ? (
                  <Select
                    aria-label="Font"
                    name="font"
                    defaultSelectedKeys={[inputAttr.defaultValue]}
                  >
                    <SelectItem key="font-cal">Cal Sans</SelectItem>
                    <SelectItem key="font-lora">Lora</SelectItem>
                    <SelectItem key="font-work">Work Sans</SelectItem>
                  </Select>
                ) : inputAttr.name === "color1" ||
                  inputAttr.name === "color2" ||
                  inputAttr.name === "color3" ? (
                  <Input
                    {...inputAttr}
                    type="color"
                    className="h-12 w-12 text-sm focus:outline-none"
                  />
                ) : inputAttr.name === "subdomain" ? (
                  <div className="flex w-full">
                    <Input {...inputAttr} required />
                    <div className="flex items-center rounded-r-md border border-l-0 px-3 text-sm">
                      {process.env.NEXT_PUBLIC_ROOT_DOMAIN}
                    </div>
                  </div>
                ) : inputAttr.name === "customDomain" ? (
                  <div className="relative flex w-full">
                    <Input {...inputAttr} />
                    {inputAttr.defaultValue && (
                      <div className="absolute right-3 z-10 flex h-full items-center">
                        <DomainStatus domain={inputAttr.defaultValue} />
                      </div>
                    )}
                  </div>
                ) : inputAttr.name === "description" ? (
                  <Textarea {...inputAttr} rows={3} required />
                ) : inputAttr.name.includes("date") ? (
                  <Input {...inputAttr} type="date" required />
                ) : (
                  <Input {...inputAttr} required />
                )}
              </div>
            );
          })}
          {!hasImage ? (
            <div className="mt-4 flex flex-col items-center justify-center space-y-2 rounded-b-lg border-t   p-3   sm:flex-row sm:justify-between sm:space-y-0 sm:px-10">
              <p className="mr-2 text-sm  ">helpText</p>
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
    <Button isDisabled={pending} type="submit">
      {pending ? <Spinner /> : <p>Save Changes</p>}
    </Button>
  );
};
