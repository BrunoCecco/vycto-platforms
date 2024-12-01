"use client";

import Image from "next/image";
import { useState } from "react";
import { SelectSite } from "@/lib/schema";
import LoginButton from "./loginButton";
import { toast } from "sonner";
import { usePostHog } from "posthog-js/react";
import { OAuthProvider } from "firebase/auth";
import { signIn } from "next-auth/react";
import { Button, Divider, Input } from "@nextui-org/react";

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

  // Handle Facebook sign in using Firebase
  const handleFacebookSignIn = async () => {
    setLoading(true);
    posthog?.capture("facebook-sign-in-clicked");

    try {
      // Sign in with Facebook
      const result = await signIn("google");
      // Get the signed-in user info
      // const user = result.user;
      // console.log("User signed in: ", user);

      // Here, you can handle additional logic like redirecting or fetching user data

      // If needed, set emailExists to false to show the username and name fields
      setEmailExists(false);
    } catch (error) {
      console.error("Error during sign in with Facebook: ", error);
      toast.error("Failed to sign in with Facebook.");
    } finally {
      setLoading(false);
    }
  };

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
    <div className="w-full text-left">
      <div className="absolute left-0 top-0 p-8 md:p-6">
        <Image
          src={"/logo.png"}
          width={40}
          height={40}
          alt="Site Logo"
          className="object-contain"
        />
        <p className="mt-1 text-xs ">
          Powered by{" "}
          <span className="text-md font-bold text-blue-700">Vycto</span>
        </p>
      </div>
      <Image
        src={siteData?.logo || "/logo.png"}
        width={100}
        height={100}
        alt="Site Logo"
        className="mb-4 object-contain"
      />

      <div className="flex flex-col gap-3">
        {emailExists && (
          <h1 className="mt-4 text-2xl font-bold ">Sign Up & Play</h1>
        )}

        {emailExists && (
          <>
            <Button onClick={() => handleGoogleSignin()}>
              <Image
                alt="google"
                src={"/googleIcon.svg"}
                width={18}
                height={18}
                className="mr-2 text-2xl "
              />
              <div className="text-sm ">Continue with Google</div>
            </Button>
            <Button onClick={() => handleAppleSignin()}>
              <Image
                alt="apple"
                src={"/appleIcon.svg"}
                width={20}
                height={20}
                className="dark: mr-2 text-2xl "
              />
              <div className="text-sm ">Continue with Apple</div>
            </Button>
          </>
        )}

        {emailExists && (
          <div className="mt-4 flex items-center justify-between">
            <div className="bg-content2 h-[1px] w-[40%]" />
            <p className="">or</p>
            <div className="bg-content2 h-[1px] w-[40%]" />
          </div>
        )}

        <div className="flex w-full flex-col !text-xs">
          {emailExists && (
            <div className="mt-4">
              <label htmlFor="email" className="mb-2 block text-sm font-medium">
                Email Address
              </label>
              <Input
                id="email"
                type="email"
                autoComplete="email"
                placeholder="buzz@lightyear.com"
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          )}
          {!emailExists && (
            <>
              <h1 className="mt-4 text-lg font-bold ">
                Bravo 🎉 Let the Competition begin!
              </h1>

              <p className="mt-4 text-sm">
                Choose a username. This is what people will see when you enter
                competitions and compete on the leaderboard.
              </p>

              <div className="mt-4">
                <label
                  htmlFor="username"
                  className="mb-2 block text-sm font-medium"
                >
                  Username
                </label>
                <Input
                  id="username"
                  type="username"
                  placeholder="buzz123"
                  onChange={(e) => setUsername(e.target.value)}
                />
              </div>
              <div className="mt-4">
                <label
                  htmlFor="fullname"
                  className="mb-2 block text-sm font-medium"
                >
                  Full Name
                </label>
                <Input
                  id="fullname"
                  type="text"
                  placeholder="Buzz Lightyear"
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
            </>
          )}
          <div className="relative mt-4 w-full">
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
      </div>

      <p className="mt-4 text-xs ">
        By continuing you agree to the{" "}
        <a
          className="font-semibold"
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
          className="font-semibold "
        >
          Privacy Policy
        </a>
      </p>
    </div>
  );
};

export default UserSignUp;
