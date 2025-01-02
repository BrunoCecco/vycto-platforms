"use client";

import { updateUserOnLogin } from "@/lib/actions";
import { parseDate } from "@internationalized/date";
import {
  Button,
  DatePicker,
  DateValue,
  Input,
  Spinner,
  user,
} from "@nextui-org/react";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { redirect, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function UpdateUser() {
  const searchParams = useSearchParams();
  const redirectUrl = searchParams.get("redirect");
  const { data: session, status, update } = useSession();
  const [loading, setLoading] = useState(true);
  const [username, setUsername] = useState(searchParams.get("username"));
  const [birthDate, setBirthDate] = useState<DateValue | null>(
    parseDate(searchParams.get("birthDate") || ""),
  );
  const [name, setName] = useState(searchParams.get("name"));

  useEffect(() => {
    updateUser();
  }, [session]);

  useEffect(() => {
    if (!loading && username && name) {
      redirect("/");
    }
  }, [loading]);

  const updateUser = async () => {
    if (!session || !session.user) return;
    if (username && username.trim().length > 0) {
      await updateUserOnLogin(
        session?.user.email as string,
        "username",
        username || "",
      );
    }
    if (name && name.trim().length > 0) {
      await updateUserOnLogin(
        session?.user.email as string,
        "name",
        name || "",
      );
    }
    if (birthDate && birthDate?.toString()?.trim().length > 0) {
      await updateUserOnLogin(
        session?.user.email as string,
        "birthDate",
        birthDate.toString() || "",
      );
    }
    await update({
      user: {
        ...session.user,
        username: username || session.user.username,
        name: name || session.user.name,
        birthDate: birthDate?.toString() || session.user.birthDate,
      },
    });
    setLoading(false);
  };

  const handleLogin = async () => {
    if (redirectUrl) {
      await handleLoginToSubmit();
    } else {
      await handleNormalLogin();
    }
  };

  const handleLoginToSubmit = async () => {
    try {
      await updateUser();
      if (redirectUrl) {
        redirect(redirectUrl);
      } else {
        redirect("/");
      }
    } catch (error) {
      console.error("Error: ", error);
    }
  };

  const handleNormalLogin = async () => {
    try {
      await updateUser();
      redirect("/");
    } catch (error) {
      console.error("An unexpected error occurred");
    }
  };

  return loading ? (
    <Spinner />
  ) : (
    <div>
      <div
        className="relative z-10 flex w-full justify-end transition-all delay-100 duration-500 md:w-[50vw]"
        style={{ backdropFilter: "blur(12px)" }}
      >
        <div className={`flex w-full flex-col px-2`}>
          <div
            className="m-auto pb-2 "
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 1,
              width: 400,
              maxWidth: "100%",
              borderRadius: "sm",
            }}
          >
            <div className={`flex flex-col gap-3`}>
              <div className="gap-1">
                <h1 className="mb-2 ">
                  <div>Bravo&nbsp;🎉 &nbsp;Let the Competition begin!</div>
                </h1>
              </div>
            </div>

            <div className="mb-2 text-sm ">
              Choose a username. This is what people will see on the leaderboard
              when you enter competitions.
            </div>

            <div className={`flex flex-col gap-4`}>
              <form className="flex flex-col gap-2">
                <>
                  <Input
                    id="username"
                    label="Username"
                    type="username"
                    autoComplete="username"
                    onChange={(e) => setUsername(e.target.value)}
                  />
                  <Input
                    id="fullname"
                    label="Full Name"
                    type="fullname"
                    autoComplete="fullname"
                    onChange={(e) => setName(e.target.value)}
                  />
                  <DatePicker
                    name="birthDate"
                    label={"Birth Date"}
                    showMonthAndYearPickers
                    onChange={setBirthDate}
                  />
                </>
                <div className="mt-2 flex flex-col gap-4">
                  <Button onClick={handleLogin} type="submit">
                    Let&apos;s Go!
                  </Button>
                </div>
              </form>
            </div>
          </div>
          <div className="py-3">
            <div className="text-center">
              <div className="flex items-center justify-center">
                <div className="font-space pr-1.5">powered by</div>
                <div className="relative h-8 w-12">
                  {/* White logo for dark mode */}
                  <Image
                    src="/vyctoLogoWhite.png"
                    alt="Vycto Logo"
                    layout="fill"
                    objectFit="contain"
                    className="hidden h-full w-full dark:block"
                    priority
                  />
                  {/* Blue logo for light mode */}
                  <Image
                    src="/vyctoLogoBlue.png"
                    alt="Vycto Logo"
                    layout="fill"
                    objectFit="contain"
                    className="h-full w-full dark:hidden"
                    priority
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
