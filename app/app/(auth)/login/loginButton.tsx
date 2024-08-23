"use client";

import LoadingDots from "@/components/icons/loading-dots";
import { signIn } from "next-auth/react";
import { useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";
import { toast } from "sonner";

export default function LoginButton({ email }: { email: string }) {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  // Get error message added by next/auth in URL.
  const searchParams = useSearchParams();

  useEffect(() => {
    const errorMessage = Array.isArray(error) ? error.pop() : error;
    errorMessage && toast.error(errorMessage);
    setError(searchParams?.get("error") || "");
  }, [error]);

  return (
    <>
      <button
        disabled={loading}
        onClick={() => signIn("apple")}
        // onClick={() => {
        //   setLoading(true);
        //   signIn("email", {
        //     email,
        //   }).then((res) => {
        //     if (res?.ok && !res?.error) {
        //       setMessage("Email sent - check your inbox!");
        //     } else {
        //       setError("Error sending email - try again?");
        //     }
        //   });
        // }}
        className={`${
          loading
            ? "cursor-not-allowed bg-stone-50 dark:bg-stone-800"
            : "bg-white hover:bg-stone-50 active:bg-stone-100 dark:bg-black dark:hover:border-white dark:hover:bg-black"
        } group my-2 flex h-10 w-full items-center justify-center space-x-2 rounded-md border border-stone-200 transition-colors duration-75 focus:outline-none dark:border-stone-700`}
      >
        {loading ? (
          <LoadingDots color="#A8A29E" />
        ) : (
          <p className="text-sm font-medium text-stone-600 dark:text-stone-400">
            Sign in with Email
          </p>
        )}
      </button>
      {message && (
        <p className="text-sm text-stone-500 dark:text-stone-400">{message}</p>
      )}
      {/* {error !== "" && (
        <p className="text-sm text-stone-500 dark:text-stone-400">{error}</p>
      )} */}
    </>
  );
}
