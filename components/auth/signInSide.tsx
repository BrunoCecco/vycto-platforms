"use client";

import { SelectSite } from "@/lib/schema";
import { OAuthProvider } from "firebase/auth";
import { signIn } from "next-auth/react";
import Image from "next/image";
import { usePostHog } from "posthog-js/react";
import * as React from "react";
import { useState } from "react";
import LoginButton from "./loginButton";
import Button from "../buttons/button";
import { Apple, AppleIcon, MoonIcon, SunIcon } from "lucide-react";

const useColorScheme = () => {
  const [mode, setMode] = React.useState<"light" | "dark">("light");

  return {
    mode,
    setMode,
  };
};

function ColorSchemeToggle() {
  const { mode, setMode } = useColorScheme();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);

    // Sync Tailwind's dark mode class with MUI's color scheme
    if (mode === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [mode]);

  return (
    <Button
      aria-label="toggle light/dark mode"
      variant="outline"
      disabled={!mounted}
      onClick={(event) => {
        setMode(mode === "light" ? "dark" : "light");
      }}
      className="group h-12 w-12"
    >
      {mode === "light" ? (
        <MoonIcon className="text-black" size={20} />
      ) : (
        <SunIcon className="text-white group-hover:text-black" />
      )}
    </Button>
  );
}

export default function UserSignUp({
  siteData,
  localAnswers,
  competitionSlug,
}: {
  siteData?: SelectSite;
  localAnswers?: { [key: string]: string };
  competitionSlug?: string;
}) {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [emailExists, setEmailExists] = useState(true);

  const posthog = usePostHog();

  React.useEffect(() => {
    const isInstagramBrowser = navigator.userAgent.includes("Instagram");

    if (!isInstagramBrowser && window.location.href.includes("fbclid=")) {
      handleGoogleSignin();
    }
  }, []);

  const handleGoogleSignin = async () => {
    // Check if the user is on the Instagram browser
    const isInstagramBrowser = navigator.userAgent.includes("Instagram");

    if (isInstagramBrowser) {
      // Construct the safari redirect URL with the current page
      const currentUrl = window.location.href;
      const safariRedirectUrl = `x-safari-${currentUrl}`;

      // Redirect to safari
      window.location.href = safariRedirectUrl;
      return;
    }

    setLoading(true);
    posthog?.capture("google-sign-in-clicked");

    try {
      const res = await signIn("google", {
        redirect: false,
      });
      console.log("User signed in: ", res);
    } catch (error: any) {
      const errorCode = error.code;
      const errorMessage = error.message;
      console.error("Error during sign in with Google: ", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAppleSignin = async () => {
    setLoading(true);
    posthog?.capture("apple-sign-in-clicked");

    try {
      const res = await signIn("apple", {
        is_private_email: false,
      });
      console.log("User signed in: ", res);
    } catch (error: any) {
      const errorCode = error.code;
      const errorMessage = error.message;
      // The email of the user's account used.
      const email = error.customData.email;
      // The credential that was used.
      const credential = OAuthProvider.credentialFromError(error);
      console.error("Error during sign in with Apple: ", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="bg-white dark:bg-[rgba(19,19,24,0.4)]">
        <div
          className="relative z-10 flex w-full justify-end bg-[rgba(255,255,255,0.2)] transition-all delay-100 duration-500 dark:bg-[rgba(19,19,24,0.4)] md:w-[50vw]"
          style={{ backdropFilter: "blur(12px)" }}
        >
          <div className="flex min-h-[100vh] w-full flex-col px-2">
            <header className="flex justify-end pt-2">
              <ColorSchemeToggle />
            </header>
            <div
              className="m-auto pb-2 dark:text-white"
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
                  src={siteData?.logo ?? "/logo.png"}
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
                    <h1 className="dark:text-white">
                      <div>Sign In & Play </div>
                    </h1>
                  ) : (
                    <h1 className="dark:text-white">
                      <div>Bravo&nbsp;🎉 &nbsp;Let the Competition begin!</div>
                    </h1>
                  )}
                </div>
                {emailExists && (
                  <>
                    <Button
                      onClick={() => handleGoogleSignin()}
                      className="w-full bg-gray-400 hover:bg-gray-500 dark:bg-gray-600 dark:hover:bg-gray-700"
                    >
                      <Image
                        alt="google"
                        src={"/googleIcon.svg"}
                        width={20}
                        height={20}
                        className="mr-2 text-2xl text-white dark:text-gray-200"
                      />
                      <div>Continue with Google</div>
                    </Button>
                    <Button
                      onClick={() => handleAppleSignin()}
                      className="w-full bg-gray-400 hover:bg-gray-500 dark:bg-gray-600 dark:hover:bg-gray-700"
                    >
                      <Image
                        alt="apple"
                        src={"/appleIcon.svg"}
                        width={20}
                        height={20}
                        className="mr-2 text-2xl text-white dark:text-gray-200"
                      />
                      <div>Continue with Apple</div>
                    </Button>
                  </>
                )}
              </div>

              {emailExists ? (
                <div className="text-center dark:text-white">
                  <div>or</div>
                </div>
              ) : (
                <div className="dark:text-white">
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
                      <label className="dark:text-white">
                        <div>Email</div>
                      </label>
                      <input
                        id="email"
                        type="email"
                        autoComplete="email"
                        onChange={(e) => setEmail(e.target.value)}
                        className="mt-1 block w-full rounded-md border border-gray-300 py-1.5 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-700 dark:bg-gray-800"
                      />
                    </div>
                  ) : (
                    <>
                      <div>
                        <label className="dark:text-white">
                          <div>Username</div>
                        </label>
                        <input
                          id="username"
                          type="username"
                          autoComplete="username"
                          onChange={(e) => setUsername(e.target.value)}
                          className="mt-1 block w-full rounded-md border border-gray-300 px-2 py-1.5 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-700 dark:bg-gray-800"
                        />
                      </div>
                      <div>
                        <label className="dark:text-white">
                          <div>Full Name</div>
                        </label>
                        <input
                          id="fullname"
                          type="fullname"
                          autoComplete="fullname"
                          onChange={(e) => setName(e.target.value)}
                          className="mt-1 block w-full rounded-md border border-gray-300 px-2 py-1.5 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-700 dark:bg-gray-800"
                        />
                      </div>
                    </>
                  )}
                  <div className="mt-2 flex flex-col gap-4">
                    <LoginButton
                      email={email}
                      username={username}
                      localAnswers={localAnswers}
                      competitionSlug={competitionSlug}
                      name={name}
                      setEmailExists={setEmailExists}
                    />
                    {emailExists && (
                      <p className="text-xs">
                        By continuing you agree to the{" "}
                        <a
                          className="font-semibold text-gray-800 dark:text-gray-300"
                          href="https://vycto.com/terms&conditions"
                          rel="noreferrer"
                          target="_blank"
                        >
                          Terms of use
                        </a>{" "}
                        and{" "}
                        <a
                          href="https://vycto.com/privacy-policy"
                          rel="noreferrer"
                          target="_blank"
                          className="font-semibold text-gray-800 dark:text-gray-300"
                        >
                          Privacy Policy
                        </a>
                      </p>
                    )}
                  </div>
                </form>
              </div>
            </div>
            <footer className="py-3 dark:text-white">
              <div className="text-center">
                <div className="flex items-center justify-center">
                  <div className="pr-1.5 font-space">powered by</div>
                  <div className="relative h-8 w-12">
                    {/* White logo for dark mode */}
                    <Image
                      src="/vyctoLogoWhite.png"
                      alt="Vycto Logo"
                      layout="fill"
                      objectFit="contain"
                      className="hidden h-full w-full dark:block"
                    />
                    {/* Blue logo for light mode */}
                    <Image
                      src="/vyctoLogoBlue.png"
                      alt="Vycto Logo"
                      layout="fill"
                      objectFit="contain"
                      className="h-full w-full dark:hidden"
                    />
                  </div>
                </div>
              </div>
            </footer>
          </div>
        </div>
        <div
          className={`fixed bottom-0 right-0 top-0 h-full bg-[url(/loginBanner.png)] dark:bg-[url(/loginBannerDark.png)] ${"left-0 md:left-[50vw]"} bg-cover bg-center bg-no-repeat delay-100 duration-500`}
          style={{
            transition: "background-image 0.4s, left 0.4s",
          }}
        />
      </div>
    </div>
  );
}
