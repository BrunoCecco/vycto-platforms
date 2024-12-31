// app/banner.js
"use client";
import { useEffect, useState } from "react";
import { usePostHog } from "posthog-js/react";
import { Button } from "@nextui-org/react";

export function cookieConsentGiven() {
  if (!localStorage.getItem("cookie_consent")) {
    return "undecided";
  }
  return localStorage.getItem("cookie_consent");
}

export default function CookieBanner() {
  const [consentGiven, setConsentGiven] = useState("");
  const posthog = usePostHog();

  useEffect(() => {
    // We want this to only run once the client loads
    // or else it causes a hydration error
    setConsentGiven(cookieConsentGiven() || "undecided");
  }, []);

  useEffect(() => {
    if (consentGiven !== "") {
      posthog.set_config({
        persistence: consentGiven === "yes" ? "localStorage+cookie" : "memory",
      });
    }
  }, [consentGiven]);

  const handleAcceptCookies = () => {
    localStorage.setItem("cookie_consent", "yes");
    setConsentGiven("yes");
  };

  const handleDeclineCookies = () => {
    localStorage.setItem("cookie_consent", "no");
    setConsentGiven("no");
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 p-4">
      {consentGiven === "undecided" && (
        <div className="flex flex-col gap-2 rounded-lg bg-background p-4 shadow-lg">
          <p>
            We use tracking cookies to understand how you use the product and
            help us improve it.
          </p>
          <div className="flex items-center gap-2">
            <Button onClick={handleAcceptCookies}>Accept cookies</Button>
            <Button onClick={handleDeclineCookies}>Decline cookies</Button>
          </div>
        </div>
      )}
    </div>
  );
}
