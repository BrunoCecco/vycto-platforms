"use client";

import { SelectSite } from "@/lib/schema";
import { OAuthProvider } from "firebase/auth";
import { signIn } from "next-auth/react";
import Image from "next/image";
import { usePostHog } from "posthog-js/react";
import * as React from "react";
import { useState } from "react";
import LoginButton from "./loginButton";
import {
  Button,
  Checkbox,
  CheckboxGroup,
  DatePicker,
  DateValue,
  Input,
  Spinner,
} from "@nextui-org/react";
import { useTheme } from "next-themes";
import { parseDate } from "@internationalized/date";
import { toast } from "sonner";
import { ArrowLeft } from "lucide-react";
import { useSearchParams } from "next/navigation";

export default function SignInSide({ siteData }: { siteData?: SelectSite }) {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [birthDate, setBirthDate] = useState<DateValue | null>();
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [emailExists, setEmailExists] = useState(true);
  const { systemTheme, theme, setTheme } = useTheme();

  const searchParams = useSearchParams();

  const compslug = searchParams.get("compslug");

  const posthog = usePostHog();

  React.useEffect(() => {
    const isInstagramBrowser = navigator.userAgent.includes("Instagram");
    const device = getMobileOperatingSystem();

    if (isInstagramBrowser) {
      // redirect to default browser (safari or chrome)
      const currentUrl = window.location.href;
      if (device === "iOS") {
        const safariRedirectUrl = `x-safari-${currentUrl}`;
        // Redirect to safari
        window.location.href = safariRedirectUrl;
      } else if (device === "Android") {
        // const chromeRedirectUrl = `googlechrome://${currentUrl}`;
        // Redirect to chrome
        // window.location.href = chromeRedirectUrl;
        window.open("googlechrome://navigate?url=" + currentUrl, "_system");
      } else {
        console.error("Unknown device");
      }
    }
  }, []);

  React.useEffect(() => {
    if (document.documentElement.classList.contains("dark")) {
      setTheme("dark");
    }
    if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
      setTheme("dark");
    }
  }, []);

  function getMobileOperatingSystem() {
    var userAgent = navigator.userAgent;

    // Windows Phone must come first because its UA also contains "Android"
    if (/windows phone/i.test(userAgent)) {
      return "Windows Phone";
    }

    if (/android/i.test(userAgent)) {
      return "Android";
    }

    // iOS detection from: http://stackoverflow.com/a/9039885/177710
    if (/iPad|iPhone|iPod/.test(userAgent)) {
      return "iOS";
    }

    return "unknown";
  }

  const handleLogin = async (provider: string) => {
    // Check if the user is on the Instagram browser
    const isInstagramBrowser = navigator.userAgent.includes("Instagram");

    if (isInstagramBrowser && provider === "google") {
      // Construct the safari redirect URL with the current page
      const currentUrl = window.location.href;
      const safariRedirectUrl = `x-safari-${currentUrl}`;

      // Redirect to safari
      window.location.href = safariRedirectUrl;
      return;
    }

    if (compslug) {
      await handleLoginToSubmit(provider);
    } else {
      await handleNormalLogin(provider);
    }
  };

  const handleLoginToSubmit = async (provider: string) => {
    posthog?.capture(`sign-in-${provider}-competition-page-clicked`);

    var callbackUrl = `/updateuser?${searchParams.toString()}`;
    try {
      const result = await signIn(provider, {
        callbackUrl,
      });
    } catch (error) {
      console.error("Error during sign in with Apple: ", error);
    }
  };

  const handleNormalLogin = async (provider: string) => {
    posthog?.capture(`sign-in-${provider}-clicked`);
    var callbackUrl = "/updateuser";
    try {
      const result = await signIn(provider, {
        callbackUrl,
      });
    } catch (error) {
      console.error("An unexpected error occurred");
    }
  };

  const constructRedirectUrl = () => {
    var redirectUrl = `/comp/${compslug}?`;
    searchParams.forEach(async (value, key) => {
      if (key != "compslug") {
        redirectUrl += `${key}=${value}&`;
      }
    });
    redirectUrl = redirectUrl.slice(0, -1); // remove last &
    return redirectUrl;
  };

  return (
    <div className="h-screen">
      <div
        className="relative z-10 flex w-full justify-end transition-all delay-100 duration-500 md:w-[50vw]"
        style={{ backdropFilter: "blur(12px)" }}
      >
        <div className={`flex min-h-[100vh] w-full flex-col px-2`}>
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
            <div className="flex justify-center pb-4">
              <Image
                src={siteData?.logo || "/logo.png"}
                width={100}
                height={100}
                alt="Site Logo"
                className="flex h-32 w-32 object-contain"
              />
            </div>
            <div
              className={`flex flex-col gap-3 ${emailExists ? "mb-2" : "mb-0"}`}
            >
              <div className="gap-1">
                {emailExists ? (
                  <div className="flex flex-col gap-2">
                    <h1 className="text-2xl font-bold ">Sign In & Play</h1>
                  </div>
                ) : (
                  <h1 className="mb-2 ">
                    <div>Bravo&nbsp;🎉 &nbsp;Let the Competition begin!</div>
                  </h1>
                )}
              </div>
              {emailExists && (
                <>
                  <Button onClick={() => handleLogin("google")}>
                    <Image
                      alt="google"
                      src={"/googleIcon.svg"}
                      width={18}
                      height={18}
                      className="dark: mr-2 text-2xl "
                    />
                    {loading ? (
                      <Spinner />
                    ) : (
                      <div className="text-sm ">Continue with Google</div>
                    )}
                  </Button>
                  <Button onClick={() => handleLogin("apple")}>
                    <Image
                      alt="apple"
                      src={"/appleIcon.svg"}
                      width={20}
                      height={20}
                      className="dark: mr-2 text-2xl "
                    />
                    {loading ? (
                      <Spinner />
                    ) : (
                      <div className="e text-sm">Continue with Apple</div>
                    )}
                  </Button>
                </>
              )}
            </div>

            {emailExists ? (
              <div className="text-center ">
                <div>or</div>
              </div>
            ) : (
              <div className="mb-2 text-sm ">
                Choose a username. This is what people will see on the
                leaderboard when you enter competitions.
              </div>
            )}

            <div
              className={`flex flex-col gap-4 ${emailExists ? "mt-2" : "mt-0"}`}
            >
              <form className="flex flex-col gap-2">
                {emailExists ? (
                  <div>
                    <label className="">
                      <div>Email</div>
                    </label>
                    <Input
                      id="email"
                      type="email"
                      autoComplete="email"
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                ) : (
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
                )}
                <div className="mt-2 flex flex-col gap-4">
                  <LoginButton
                    email={email}
                    username={username}
                    birthDate={birthDate?.toString()}
                    compCallback={compslug ? constructRedirectUrl() : undefined}
                    name={name}
                    setEmailExists={setEmailExists}
                  />
                  {!emailExists && (
                    <div
                      className="flex w-min cursor-pointer items-center gap-1 text-xs hover:opacity-75"
                      onClick={() => setEmailExists(true)}
                    >
                      <ArrowLeft size={16} />
                      <div>Back</div>
                    </div>
                  )}
                  {emailExists && (
                    <div className="text-xs">
                      By continuing you agree to the{" "}
                      <a
                        className="dark: font-semibold "
                        href={siteData?.terms || ""}
                        rel="noreferrer"
                        target="_blank"
                      >
                        Terms of use
                      </a>{" "}
                      and{" "}
                      <a
                        href={siteData?.privacypolicy || ""}
                        rel="noreferrer"
                        target="_blank"
                        className="dark: font-semibold "
                      >
                        Privacy Policy
                      </a>
                    </div>
                  )}
                </div>
              </form>
            </div>
          </div>
          <div className="py-3">
            <div className="text-center">
              <div className="flex items-center justify-center">
                <div className="pr-1.5">powered by</div>
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
      <div
        className={`fixed bottom-0 right-0 top-0 flex h-full w-full bg-cover bg-center bg-no-repeat object-cover transition-all delay-100 duration-500 md:w-[50vw]`}
        style={{
          transition: "background-image 0.4s, left 0.4s",
          backgroundImage: `url(${
            theme == "light"
              ? siteData?.loginBanner! || "/loginBanner.png"
              : siteData?.loginBannerDark! || "/loginBannerDark.png"
          })`,
        }}
      />
    </div>
  );
}
