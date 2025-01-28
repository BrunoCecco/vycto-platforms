// app/banner.js
"use client";
import { useEffect, useState } from "react";
import { usePostHog } from "posthog-js/react";
import { Button } from "@nextui-org/react";

export function cookieConsentGiven() {
  if (localStorage && !localStorage.getItem("cookie_consent")) {
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

  const handleAcceptOptionalCookies = () => {
    localStorage.setItem("cookie_consent", "yes");
    setConsentGiven("yes");
  };

  const handleDeclineOptionalCookies = () => {
    localStorage.setItem("cookie_consent", "no");
    setConsentGiven("no");
  };

  return (
    cookieConsentGiven() === "undecided" && (
      <div className="fixed bottom-0 left-0 right-0 flex flex-col gap-2 rounded-lg bg-background p-4">
        <p>
          We use mandatory cookies for authentication and handling your
          sessions.
        </p>
        {consentGiven === "undecided" && (
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
    )
  );
}
