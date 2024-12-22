"use client";

import LoadingDots from "@/components/icons/loadingDots";
import { cn } from "@/lib/utils";
import { useParams, useRouter } from "next/navigation";
import { toast } from "sonner";
import DomainStatus from "./domainStatus";
import DomainConfiguration from "./domainConfiguration";
import va from "@vercel/analytics";
import { useSession } from "next-auth/react";
import {
  Select,
  SelectItem,
  Button,
  Input,
  Textarea,
  Spinner,
  DatePicker,
  Switch,
  Card,
  CardBody,
} from "@nextui-org/react";
import { USER_ROLES } from "@/lib/constants";
import ReactFlagsSelect from "react-flags-select";
import { useEffect, useRef, useState } from "react";
import { useFormStatus } from "react-dom";
import {
  parseDate,
  parseZonedDateTime,
  getLocalTimeZone,
  parseAbsoluteToLocal,
} from "@internationalized/date";
import CombinedFormImage from "./combinedFormImage";
import Toggle from "@/components/ui/toggle";
import { I18nProvider } from "@react-aria/i18n";

interface InputAttr {
  name: string;
  type: string;
  defaultValue: string;
  label?: string;
  placeholder?: string;
  maxLength?: number;
  pattern?: string;
  min?: string;
}

interface ICheckboxValues {
  [key: string]: string;
}

export default function CombinedForm({
  title,
  helpText,
  inputAttrs,
  handleSubmit,
  className,
  updateId,
}: {
  title: String;
  helpText: string;
  inputAttrs: InputAttr[];
  handleSubmit: any;
  className?: string;
  updateId?: string;
}) {
  const form2 = useRef<HTMLFormElement>(null);
  const form2button = useRef<HTMLButtonElement>(null);
  const { id } = useParams() as { id?: string };
  const router = useRouter();
  const { update } = useSession();
  const [selectedCountry, setSelectedCountry] = useState(
    inputAttrs.find((inputAttr) => inputAttr.name === "country")?.defaultValue,
  );
  const [checkboxValues, setCheckboxValues] = useState<ICheckboxValues>({
    fanzoneNotifications:
      inputAttrs.find((inputAttr) => inputAttr.name == "fanzoneNotifications")
        ?.defaultValue || "false",
    prizeNotifications:
      inputAttrs.find((inputAttr) => inputAttr.name == "prizeNotifications")
        ?.defaultValue || "false",
    newsletter:
      inputAttrs.find((inputAttr) => inputAttr.name === "newsletter")
        ?.defaultValue || "false",
  });
  const [imageInputAttr, setImageInputAttr] = useState(
    inputAttrs.find((inputAttr) => inputAttr.type.includes("file")),
  );
  const [usernameInputAttr, setUsernameInputAttr] = useState(
    inputAttrs.find((inputAttr) => inputAttr.name === "username"),
  );
  const [countryInputAttr, setCountryInputAttr] = useState(
    inputAttrs.find((inputAttr) => inputAttr.name === "country"),
  );
  const [favouritePlayerInputAttr, setFavouritePlayerInputAttr] = useState(
    inputAttrs.find((inputAttr) => inputAttr.name === "favouritePlayer"),
  );

  useEffect(() => {
    if (
      form2button.current &&
      selectedCountry !=
        inputAttrs.find((inputAttr) => inputAttr.name === "country")
          ?.defaultValue
    ) {
      form2button.current.click();
    }
  }, [selectedCountry]);

  const editCheckboxValues = (isSelected: boolean, name: string) => {
    console.log(isSelected, name, isSelected.toString());
    setCheckboxValues({ ...checkboxValues, [name]: isSelected.toString() });
  };

  const formAction = async (data: FormData) => {
    let fields = Array.from(data.entries());
    let changedFields = fields.filter(
      ([key, value]) =>
        value !==
        inputAttrs.find((inputAttr) => inputAttr.name === key)?.defaultValue,
    );
    const res = await Promise.all(
      changedFields.map((field) =>
        handleSubmit(data, updateId || id, field[0]).then(async (res: any) => {
          if (!res) return;
          if (res.error) {
            toast.error(res.error);
          } else {
            va.track(`Updated ${field[0]}`, id ? { id } : {});
          }
        }),
      ),
    );
    toast.success(`Successfully updated ${title}!`);
  };

  const submitForm2 = () => {
    if (form2.current) {
      form2.current.requestSubmit();
    }
  };

  const SpecialInputAttrs = () => {
    if (
      !imageInputAttr &&
      !usernameInputAttr &&
      !countryInputAttr &&
      !favouritePlayerInputAttr
    ) {
      return null;
    }
    return (
      <div className="w-full px-5 pt-5 sm:w-1/3 sm:pr-0 sm:pt-0">
        <div className="flex w-full flex-col gap-6 rounded-lg border p-4">
          {imageInputAttr && (
            <CombinedFormImage
              name={imageInputAttr.name}
              image={imageInputAttr.defaultValue}
              handleSubmit={handleSubmit}
              updateId={updateId}
              placeholder={imageInputAttr.name + imageInputAttr.label}
            />
          )}
          <form
            action={formAction}
            className="flex w-full flex-1 flex-col gap-6"
            ref={form2}
          >
            {usernameInputAttr && (
              <Input
                key={"username"}
                {...usernameInputAttr}
                onBlur={submitForm2}
              />
            )}
            {countryInputAttr && (
              <>
                <input
                  type="hidden"
                  key={"country"}
                  hidden
                  name="country"
                  value={selectedCountry}
                />
                <div className="rounded-xl bg-content2 pt-2">
                  <div className="px-3 text-xs text-default-600">Country</div>
                  <ReactFlagsSelect
                    key={"country-select"}
                    selectButtonClassName="!bg-content2 !text-sm !rounded-xl !border-none !text-foreground !py-1 !px-2"
                    className="!rounded-xl !border-none !p-0 !text-sm !text-black"
                    selected={selectedCountry || ""}
                    onSelect={(code) => setSelectedCountry(code)}
                    optionsSize={14}
                  />
                </div>
              </>
            )}
            {favouritePlayerInputAttr && (
              <Input
                key={"favouritePlayer"}
                {...favouritePlayerInputAttr}
                onBlur={submitForm2}
              />
            )}
            <button type="submit" hidden ref={form2button}></button>
          </form>
        </div>
      </div>
    );
  };

  return (
    <div className="rounded-lg border">
      <h2 className="p-5 text-xl">{title}</h2>
      <div className="flex flex-col sm:flex-row">
        {SpecialInputAttrs()}
        <form
          action={formAction}
          className="flex w-full flex-1 flex-col gap-6 px-5"
        >
          {inputAttrs.map((inputAttr, index) => {
            if (
              ["favouritePlayer", "username", "country"].includes(
                inputAttr.name,
              )
            ) {
              return null;
            }
            if (inputAttr.name === "divider") {
              return (
                <div
                  key={index}
                  className="my-4 w-full border-1.5 border-b border-content4"
                ></div>
              );
            }
            return (
              <div className="relative w-full" key={inputAttr.name}>
                {inputAttr.name.toLowerCase().includes("image") ||
                inputAttr.type == "file" ? null : inputAttr.name === "role" ? (
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
                    <Input {...inputAttr} />
                    <div className="flex -translate-x-2 items-center rounded-r-xl bg-content2 px-3 text-sm">
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
                  <Textarea {...inputAttr} rows={3} />
                ) : inputAttr.type == "date" ? (
                  <I18nProvider locale="en-GB">
                    <DatePicker
                      {...inputAttr}
                      defaultValue={
                        inputAttr.defaultValue.includes("[UTC]")
                          ? parseZonedDateTime(inputAttr.defaultValue)
                          : parseDate(inputAttr.defaultValue)
                      }
                      showMonthAndYearPickers
                    />
                  </I18nProvider>
                ) : inputAttr.type == "checkbox" ? (
                  <>
                    <input
                      id={inputAttr.name}
                      key={inputAttr.name}
                      type="hidden"
                      hidden
                      name={inputAttr.name}
                      value={checkboxValues[inputAttr.name] || "false"}
                    />
                    <Toggle
                      id={inputAttr.name + "switch"}
                      key={inputAttr.name + "switch"}
                      isSelected={checkboxValues[inputAttr.name] == "true"}
                      onToggle={(isSelected: boolean) =>
                        editCheckboxValues(isSelected, inputAttr.name)
                      }
                      label={inputAttr.label}
                    />
                  </>
                ) : (
                  <Input
                    id={inputAttr.name}
                    key={inputAttr.name}
                    {...inputAttr}
                  />
                )}
              </div>
            );
          })}
          {!imageInputAttr ? (
            <div className="mt-4 flex flex-col items-center justify-center space-y-2 rounded-b-lg border-t   p-3   sm:flex-row sm:justify-between sm:space-y-0 sm:px-10">
              <p className="mr-2 text-sm">{helpText}</p>
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
