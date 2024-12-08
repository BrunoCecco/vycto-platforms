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
import { USER_ROLES } from "@/lib/constants";
import { Button, Spinner } from "@nextui-org/react";
import { Input, Select, SelectItem, Textarea } from "@nextui-org/react";
import CountryPicker from "../settings/countryPicker";
import ReactFlagsSelect from "react-flags-select";
import { useState } from "react";
import { useFormStatus } from "react-dom";

export default function Form({
  title,
  description,
  helpText,
  inputAttrs,
  handleSubmit,
  bucketId,
  bucketName,
  updateId,
  circular = false,
  children,
}: {
  title: string;
  description: string;
  helpText?: string;
  inputAttrs: {
    name: string;
    type: string;
    defaultValue: string;
    placeholder?: string;
    maxLength?: number;
    pattern?: string;
  };
  handleSubmit: any;
  bucketId?: string;
  bucketName?: string;
  updateId?: string;
  circular?: boolean;
  children?: React.ReactNode;
}) {
  const { id } = useParams() as { id?: string };
  const router = useRouter();
  const { update } = useSession();
  const [selectedCountry, setSelectedCountry] = useState(
    inputAttrs.name === "country" ? inputAttrs.defaultValue : "",
  );

  return inputAttrs.type == "file" ? (
    <Uploader
      id={inputAttrs.name}
      title={title}
      description={description}
      defaultValue={
        inputAttrs.defaultValue != "" ? inputAttrs.defaultValue : null
      }
      name={inputAttrs.name}
      upload={(name: string, value: string) => {
        const formData = new FormData();
        // append input as file type to form data
        formData.append(name, value);
        handleSubmit(formData, updateId || id, name).then(async (res: any) => {
          if (res.error) {
            toast.error(res.error);
          } else {
            va.track(`Updated ${name}`, id ? { id } : {});
            toast.success(`Successfully updated ${name}!`);
          }
        });
      }}
      bucketId={bucketId}
      bucketName={bucketName}
      circular={circular}
    >
      {children}
    </Uploader>
  ) : (
    <form
      action={async (data: FormData) => {
        if (
          inputAttrs.name === "customDomain" &&
          inputAttrs.defaultValue &&
          data.get("customDomain") !== inputAttrs.defaultValue &&
          !confirm("Are you sure you want to change your custom domain?")
        ) {
          return;
        }
        handleSubmit(data, id, inputAttrs.name).then(async (res: any) => {
          if (res.error) {
            toast.error(res.error);
          } else {
            va.track(`Updated ${inputAttrs.name}`, id ? { id } : {});
            if (id) {
              router.refresh();
            } else {
              await update();
              router.refresh();
            }
            toast.success(`Successfully updated ${inputAttrs.name}!`);
          }
        });
      }}
      className="rounded-lg border"
    >
      <div className="relative flex flex-col space-y-4 p-5 sm:p-10">
        <h2 className="text-xl ">{title}</h2>
        <p className="text-sm  ">{description}</p>
        {inputAttrs.name === "country" ? (
          <>
            <input
              type="hidden"
              hidden
              name="country"
              value={selectedCountry}
            />
            <ReactFlagsSelect
              selectButtonClassName="!bg-content2 !rounded-xl !border-none !text-foreground !py-1 !px-2"
              className="!rounded-xl !border-none !bg-content2 !p-0 !text-background"
              selected={selectedCountry || ""}
              onSelect={(code) => setSelectedCountry(code)}
            />
          </>
        ) : inputAttrs.name === "role" ? (
          <Select
            aria-label="role"
            name="role"
            defaultSelectedKeys={[inputAttrs.defaultValue]}
          >
            {USER_ROLES.map((role) => (
              <SelectItem key={role} value={role}>
                {role}
              </SelectItem>
            ))}
          </Select>
        ) : inputAttrs.name === "font" ? (
          <Select
            aria-label="Font"
            name="font"
            defaultSelectedKeys={[inputAttrs.defaultValue]}
          >
            <SelectItem key="font-cal">Cal Sans</SelectItem>
            <SelectItem key="font-lora">Lora</SelectItem>
            <SelectItem key="font-work">Work Sans</SelectItem>
          </Select>
        ) : inputAttrs.name === "color1" ||
          inputAttrs.name === "color2" ||
          inputAttrs.name === "color3" ? (
          <Input {...inputAttrs} type="color" className="h-12 w-12 text-sm" />
        ) : inputAttrs.name === "subdomain" ? (
          <div className="flex w-full max-w-md">
            <Input {...inputAttrs} required />
            <div className="flex items-center rounded-r-md border border-l-0   px-3 text-sm   ">
              {process.env.NEXT_PUBLIC_ROOT_DOMAIN}
            </div>
          </div>
        ) : inputAttrs.name === "customDomain" ? (
          <div className="relative flex w-full max-w-md">
            <Input {...inputAttrs} />
            {inputAttrs.defaultValue && (
              <div className="absolute right-3 z-10 flex h-full items-center">
                <DomainStatus domain={inputAttrs.defaultValue} />
              </div>
            )}
          </div>
        ) : inputAttrs.name === "description" || inputAttrs.name === "story" ? (
          <Textarea {...inputAttrs} rows={3} required />
        ) : inputAttrs.name === "date" ? (
          <Input {...inputAttrs} type="date" required />
        ) : (
          <Input {...inputAttrs} required />
        )}
      </div>
      {inputAttrs.name === "customDomain" && inputAttrs.defaultValue && (
        <DomainConfiguration domain={inputAttrs.defaultValue} />
      )}
      <div className="flex flex-col items-center justify-center space-y-2 rounded-b-lg border-t   p-3   sm:flex-row sm:justify-between sm:space-y-0 sm:px-10">
        <p className="mr-2 text-sm  ">{helpText}</p>

        <FormButton />
      </div>
    </form>
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
