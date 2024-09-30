"use client";
import Image from "next/image";
import { signIn } from "next-auth/react";
import { useState } from "react";
import { SelectSite } from "@/lib/schema";
import LoginButton from "./loginButton";
import { toast } from "sonner";
import { usePostHog } from "posthog-js/react";
import Button from "../button";
import LoadingDots from "../icons/loadingDots";

const UserSignUp = ({
  siteData,
  localAnswers,
  competitionSlug,
}: {
  siteData?: SelectSite;
  localAnswers?: { [key: string]: string };
  competitionSlug?: string;
}) => {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [emailExists, setEmailExists] = useState(true);

  const posthog = usePostHog();

  const handleLoginToSubmit = async (provider: "apple" | "facebook") => {
    setLoading(true);

    posthog?.capture(provider + "sign-in-clicked");
    const answersQuery = Object.entries(localAnswers || {})
      .map(
        ([questionId, answer]) =>
          `${encodeURIComponent(questionId)}=${encodeURIComponent(answer)}`,
      )
      .join("&");
    var callbackUrl = `/comp/${competitionSlug}?${answersQuery}`;
    console.log(callbackUrl);
    try {
      const result = await signIn(provider, {
        callbackUrl,
      });
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async (provider: "apple" | "facebook") => {
    setLoading(true);
    posthog?.capture(provider + "sign-in-clicked");
    try {
      const result = await signIn(provider);
      console.log(result);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center bg-white md:p-8">
      <div className="w-full">
        <p className="text-xs text-gray-500">
          Powered by{" "}
          <span className="text-md font-bold text-blue-700">Vycto</span>
        </p>

        <div className="mt-6 flex flex-col items-center text-center">
          <Image
            src={siteData?.logo ?? "/logo.png"}
            width={100}
            height={100}
            alt="Site Logo"
            className="object-contain"
          />
          <h1 className="mt-4 text-2xl font-bold text-blue-700">
            Sign Up & Play
          </h1>

          {emailExists && (
            <div className="mt-6 flex w-full flex-col gap-4 md:flex-row">
              <button
                onClick={() =>
                  localAnswers || competitionSlug
                    ? handleLoginToSubmit("apple")
                    : handleLogin("apple")
                }
                className="flex w-full items-center justify-center rounded-md border border-gray-300 bg-gray-100 p-4 text-xs font-medium text-gray-700 shadow-sm md:w-1/2"
              >
                <Image
                  src="/appleIcon.svg"
                  width={20}
                  height={20}
                  alt="Apple Logo"
                  className="mr-2 h-5 w-5"
                />
                <span>Continue with Apple</span>
              </button>
              <button
                onClick={() =>
                  localAnswers || competitionSlug
                    ? handleLoginToSubmit("facebook")
                    : handleLogin("facebook")
                }
                className="flex w-full items-center justify-center rounded-md border border-gray-300 bg-gray-100 p-4 text-xs font-medium text-gray-700 shadow-sm md:w-1/2"
              >
                <Image
                  src="/facebookIcon.svg"
                  width={20}
                  height={20}
                  alt="Facebook Logo"
                  className="mr-2 h-5 w-5"
                />
                <span>Continue with Facebook</span>
              </button>
            </div>
          )}

          {emailExists && <p className="my-4 text-gray-400">or</p>}

          <div className="w-full space-y-4 !text-xs">
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700"
              >
                Email Address
              </label>
              <input
                id="email"
                type="email"
                autoComplete="email"
                placeholder="buzz@lightyear.com"
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-xs placeholder-gray-400 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              />
            </div>
            {!emailExists && (
              <>
                <h1 className="mt-4 text-center text-lg font-bold text-blue-700">
                  Bravo 🎉 Let the Competition begin!
                </h1>

                <p className="mt-2 text-center text-sm text-gray-600">
                  Choose a username. This is what people will see when you enter
                  competitions and compete on the leaderboard.
                </p>

                <div>
                  <label
                    htmlFor="username"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Username
                  </label>
                  <input
                    id="username"
                    type="username"
                    placeholder="buzz123"
                    onChange={(e) => setUsername(e.target.value)}
                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-xs placeholder-gray-400 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  />
                </div>
                <div>
                  <label
                    htmlFor="fullname"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Full Name
                  </label>
                  <input
                    id="fullname"
                    type="text"
                    placeholder="Buzz Lightyear"
                    onChange={(e) => setName(e.target.value)}
                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-xs placeholder-gray-400 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  />
                </div>
              </>
            )}
            <LoginButton
              email={email}
              username={username}
              localAnswers={localAnswers}
              competitionSlug={competitionSlug}
              name={name}
              setEmailExists={setEmailExists}
            />
          </div>
        </div>

        <p className="mt-4 text-center text-xs text-gray-500">
          By continuing you agree to the{" "}
          <a
            className="font-semibold text-gray-800"
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
            className="font-semibold text-gray-800"
          >
            Privacy Policy
          </a>
        </p>
      </div>
    </div>
  );
};

export default UserSignUp;
