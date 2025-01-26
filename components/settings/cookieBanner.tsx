// app/banner.js
"use client";
import { useEffect, useState } from "react";
import { usePostHog } from "posthog-js/react";
import { Button } from "@nextui-org/react";

export function optionalCookieConsentGiven() {
  if (!localStorage.getItem("optional_cookie_consent")) {
    return "undecided";
  }
  return localStorage.getItem("optional_cookie_consent");
}

export default function CookieBanner() {
  const [optionalConsentGiven, setOptionalConsentGiven] = useState("");
  const posthog = usePostHog();

  useEffect(() => {
    // We want this to only run once the client loads
    // or else it causes a hydration error
    setOptionalConsentGiven(optionalCookieConsentGiven() || "undecided");
  }, []);

  useEffect(() => {
    if (optionalConsentGiven !== "") {
      posthog.set_config({
        persistence:
          optionalConsentGiven === "yes" ? "localStorage+cookie" : "memory",
      });
    }
  }, [optionalConsentGiven]);

  const handleAcceptOptionalCookies = () => {
    localStorage.setItem("optional_cookie_consent", "yes");
    setOptionalConsentGiven("yes");
  };

  const handleDeclineOptionalCookies = () => {
    localStorage.setItem("optional_cookie_consent", "no");
    setOptionalConsentGiven("no");
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 flex flex-col gap-2 rounded-lg bg-background p-4">
      <p>
        We use mandatory cookies for authentication and handling your sessions.
      </p>
      {optionalConsentGiven === "undecided" && (
        <div className="flex flex-col gap-2 shadow-lg">
          <p>
            We also use optional analytics cookies to improve your experience
            and help us understand how we can improve our product.
          </p>
          <div className="flex items-center gap-2">
            <Button onClick={handleAcceptOptionalCookies}>
              Accept Optional Cookies
            </Button>
            <Button onClick={handleDeclineOptionalCookies}>
              Decline Cookies
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
