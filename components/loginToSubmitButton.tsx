"use client";

import LoadingDots from "@/components/icons/loading-dots";
import { signIn } from "next-auth/react";
import { useSearchParams, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import Input from "./input";
import { validateEmail } from "@/lib/utils";

export default function LoginToSubmitButton({
  localAnswers,
  competitionSlug,
}: {
  localAnswers: { [key: string]: string };
  competitionSlug: string;
}) {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState("");

  useEffect(() => {
    const errorMessage = Array.isArray(error) ? error.pop() : error;
    errorMessage && toast.error(errorMessage);
    setError(searchParams?.get("error") || "");
  }, [error, searchParams]);

  const handleLogin = async () => {
    if (!validateEmail(email)) {
      toast.error("Invalid email, please try again");
      return;
    }
    setLoading(true);
    const answersQuery = Object.entries(localAnswers)
      .map(
        ([questionId, answer]) =>
          `${encodeURIComponent(questionId)}=${encodeURIComponent(answer)}`,
      )
      .join("&");
    const callbackUrl = `/comp/${competitionSlug}?${answersQuery}`;
    console.log(callbackUrl);
    try {
      const result = await signIn("email", {
        email,
        callbackUrl,
        redirect: false,
      });

      if (result?.ok && !result?.error) {
        setMessage("Email sent - check your inbox!");
      } else {
        setError("Error sending email - try again?");
      }
    } catch (error) {
      setError("An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center gap-4">
      <Input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <button
        disabled={loading}
        onClick={handleLogin}
        className={`${
          loading
            ? "cursor-not-allowed bg-stone-50 dark:bg-stone-800"
            : "bg-white hover:bg-stone-50 active:bg-stone-100 dark:bg-black dark:hover:border-white dark:hover:bg-black"
        } group flex h-10 w-full items-center justify-center space-x-2 rounded-md border border-stone-200 transition-colors duration-75 focus:outline-none dark:border-stone-700`}
      >
        {loading ? (
          <LoadingDots color="#A8A29E" />
        ) : (
          <p className="text-sm font-medium text-stone-600 ">
            Sign in with email to submit
          </p>
        )}
      </button>
      {message && (
        <p className="text-center text-sm text-stone-800 ">{message}</p>
      )}
    </div>
  );
}
