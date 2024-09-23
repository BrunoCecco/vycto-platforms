"use client";

import LoadingDots from "@/components/icons/loadingDots";
import { signIn } from "next-auth/react";
import { useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { usePostHog } from "posthog-js/react";
import { validateEmail } from "@/lib/utils";

export default function LoginButton({
  email,
  username,
  localAnswers,
  competitionSlug,
  name,
}: {
  email: string;
  username: string;
  localAnswers?: { [key: string]: string };
  competitionSlug?: string;
  name?: string;
}) {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const posthog = usePostHog();
  // Get error message added by next/auth in URL.
  const searchParams = useSearchParams();

  useEffect(() => {
    const errorMessage = Array.isArray(error) ? error.pop() : error;
    errorMessage && toast.error(errorMessage);
    setError(searchParams?.get("error") || "");
  }, [error]);

  const handleLoginToSubmit = async () => {
    setLoading(true);
    if (!validateEmail(email)) {
      toast.error("Invalid email, please try again");
      return;
    }

    const answersQuery = Object.entries(localAnswers || {})
      .map(
        ([questionId, answer]) =>
          `${encodeURIComponent(questionId)}=${encodeURIComponent(answer)}`,
      )
      .join("&");
    var callbackUrl = `/comp/${competitionSlug}?${answersQuery}&username=${username}`;
    if (name && name?.trim() != "") {
      callbackUrl += `&name=${name}`;
    }
    console.log(callbackUrl);
    try {
      const result = await signIn("email", {
        email,
        callbackUrl,
        redirect: false,
      });

      if (result?.ok && !result?.error) {
        setMessage("Email sent - check your inbox to confirm your answers!");
      } else {
        setError("Error sending email - try again?");
      }
    } catch (error) {
      setError("An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async () => {
    setLoading(true);
    if (!validateEmail(email)) {
      toast.error("Invalid email, please try again");
      return;
    }
    posthog?.capture("sign-in-email-clicked");
    var callbackUrl = username ? `/newusername/${username}` : "";
    if (name && name?.trim() != "") {
      callbackUrl += `/${name}`;
    }
    signIn("email", {
      email,
      callbackUrl,
    }).then((res) => {
      if (res?.ok && !res?.error) {
        setMessage("Email sent - check your inbox!");
      } else {
        setError("Error sending email - try again?");
      }
    });
  };

  return (
    <>
      <button
        disabled={loading}
        onClick={
          localAnswers || competitionSlug ? handleLoginToSubmit : handleLogin
        }
        className={`${
          loading
            ? "cursor-not-allowed bg-blue-800"
            : "bg-blue-500  hover:bg-blue-600"
        } group my-2 flex h-10 w-full items-center justify-center space-x-2 rounded-md border border-stone-200 text-white transition-colors duration-75 focus:outline-none dark:border-stone-400`}
      >
        {loading ? (
          <LoadingDots color="#A8A29E" />
        ) : (
          <p className="text-sm font-medium">Sign in with Email</p>
        )}
      </button>
      {message && (
        <p className="text-sm text-stone-500 dark:text-stone-400">{message}</p>
      )}
      {error !== "" && (
        <p className="text-sm text-stone-500 dark:text-stone-400">{error}</p>
      )}
    </>
  );
}
