"use client";

import Lottie from "lottie-react";
import bouncingBall from "../../public/bouncingBall.json";
import { signIn } from "next-auth/react";
import { useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { usePostHog } from "posthog-js/react";
import { validateEmail } from "@/lib/utils";
import { Button } from "@nextui-org/react";

const LoadingAnimation: React.FC = () => {
  return (
    <div className="h-20 w-32">
      <Lottie animationData={bouncingBall} loop={true} />
    </div>
  );
};

export default function LoginButton({
  email,
  setEmailExists,
  username,
  localAnswers,
  competitionSlug,
  name,
}: {
  email: string;
  setEmailExists: (exists: boolean) => void;
  username?: string;
  localAnswers?: { [key: string]: string };
  competitionSlug?: string;
  name?: string;
}) {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const posthog = usePostHog(); //
  // Get error message added by next/auth in URL.
  const searchParams = useSearchParams();

  useEffect(() => {
    const errorMessage = Array.isArray(error) ? error.pop() : error;
    errorMessage && toast.error(errorMessage);
    setError(searchParams?.get("error") || "");
  }, [error]);

  const checkEmail = async () => {
    setLoading(true);
    if (!validateEmail(email)) {
      // toast.error("Invalid email, please try again");
      setLoading(false);
      return;
    }
    try {
      const response = await fetch(`/api/user/${email}`);
      if (response.ok) {
        // Email exists, proceed to sign in
        await handleLogin();
      } else {
        // Email does not exist, prompt for username
        setEmailExists(false);
        if (username && username.trim() !== "") {
          await handleLogin();
          return;
        }
        toast.info("Welcome! Please enter a username to continue.");
      }
    } catch (error) {
      console.error("Error checking email:", error);
      toast.error("Error checking email. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async () => {
    if (localAnswers || competitionSlug) {
      await handleLoginToSubmit();
    } else {
      await handleNormalLogin();
    }
  };

  const handleLoginToSubmit = async () => {
    posthog?.capture("sign-in-email-competition-page-clicked");

    const answersQuery = Object.entries(localAnswers || {})
      .map(
        ([questionId, answer]) =>
          `${encodeURIComponent(questionId)}=${encodeURIComponent(answer)}`,
      )
      .join("&");
    var callbackUrl = `/comp/${competitionSlug}?${answersQuery}`;
    if (username && username?.trim() != "") {
      callbackUrl += `&username=${username}`;
    }
    if (name && name?.trim() != "") {
      callbackUrl += `&name=${name}`;
    }
    try {
      const result = await signIn("email", {
        email,
        callbackUrl,
        redirect: false,
      });

      if (result && result.ok) {
        setMessage("Email sent - check your inbox to confirm your answers!");
        toast.success("Email sent - check your inbox to confirm your answers!");
      } else {
        setError(`Error sending email ${result?.error} - try again?`);
      }
    } catch (error) {
      setError("An unexpected error occurred");
    }
  };

  const handleNormalLogin = async () => {
    posthog?.capture("sign-in-email-clicked");
    var callbackUrl = username ? `/updateuser/${username}` : "";
    if (name && name?.trim() != "") {
      callbackUrl += `/${name}`;
    }
    try {
      const result = await signIn("email", {
        email,
        callbackUrl,
        redirect: false,
      });

      console.log(result);
      if (result && result.ok) {
        setMessage("Email sent - check your inbox to start playing!");
        toast.success("Email sent - check your inbox to start playing!");
      } else {
        setError(`Error sending email ${result?.error} - try again?`);
      }
    } catch (error) {
      setError("An unexpected error occurred");
    }
  };

  return (
    <>
      {!message && (
        <>
          {loading ? (
            <div className="flex w-full items-center justify-center">
              <LoadingAnimation />
            </div>
          ) : (
            <Button type="submit" isDisabled={loading} onClick={checkEmail}>
              <p className="text-sm font-medium">Let&apos;s Play!</p>
            </Button>
          )}
        </>
      )}
      {message && (
        <p className="dark: text-center text-sm font-bold text-stone-700">
          {message}
        </p>
      )}
      {error !== "" && (
        <p className="text-sm font-bold text-red-700">{error}</p>
      )}
    </>
  );
}
