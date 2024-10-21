"use client";

import { SelectSite } from "@/lib/schema";
import AppleIcon from "@mui/icons-material/Apple";
import DarkModeRoundedIcon from "@mui/icons-material/DarkModeRounded";
import LightModeRoundedIcon from "@mui/icons-material/LightModeRounded";
import Box from "@mui/joy/Box";
import Button from "@mui/joy/Button";
import CssBaseline from "@mui/joy/CssBaseline";
import Divider from "@mui/joy/Divider";
import FormControl from "@mui/joy/FormControl";
import FormLabel from "@mui/joy/FormLabel";
import GlobalStyles from "@mui/joy/GlobalStyles";
import IconButton, { IconButtonProps } from "@mui/joy/IconButton";
import Stack from "@mui/joy/Stack";
import { CssVarsProvider, useColorScheme } from "@mui/joy/styles";
import Typography from "@mui/joy/Typography";
import { OAuthProvider } from "firebase/auth";
import { signIn } from "next-auth/react";
import Image from "next/image";
import { usePostHog } from "posthog-js/react";
import * as React from "react";
import { useState } from "react";
import LoginButton from "./loginButton";
import Email from "next-auth/providers/email";

function ColorSchemeToggle(props: IconButtonProps) {
  const { onClick, ...other } = props;
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
    <IconButton
      aria-label="toggle light/dark mode"
      size="sm"
      variant="outlined"
      disabled={!mounted}
      onClick={(event) => {
        setMode(mode === "light" ? "dark" : "light");
        onClick?.(event);
      }}
      {...other}
      sx={{
        width: 20,
        height: 20,
      }}
    >
      {mode === "light" ? <DarkModeRoundedIcon /> : <LightModeRoundedIcon />}
    </IconButton>
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
    <CssVarsProvider disableTransitionOnChange>
      <CssBaseline />
      <GlobalStyles
        styles={{
          ":root": {
            "--Form-maxWidth": "800px",
            "--Transition-duration": "0.4s", // set to `none` to disable transition
          },
        }}
      />
      <Box
        sx={(theme) => ({
          width: { xs: "100%", md: "50vw" },
          transition: "width var(--Transition-duration)",
          transitionDelay: "calc(var(--Transition-duration) + 0.1s)",
          position: "relative",
          zIndex: 1,
          display: "flex",
          justifyContent: "flex-end",
          backdropFilter: "blur(12px)",
          backgroundColor: "rgba(255 255 255 / 0.2)",
          [theme.getColorSchemeSelector("dark")]: {
            backgroundColor: "rgba(19 19 24 / 0.4)",
          },
        })}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            minHeight: "100dvh",
            width: "100%",
            px: 2,
          }}
        >
          <Box
            component="header"
            sx={{ py: 3, display: "flex", justifyContent: "space-between" }}
          >
            <Box sx={{ gap: 2, display: "flex", alignItems: "center" }}>
              <IconButton variant="soft" color="primary" size="sm">
                <Image
                  src={"/logo.png"}
                  width={40}
                  height={40}
                  alt="Site Logo"
                  className="object-contain"
                />
              </IconButton>
              <Typography level="title-lg">Powered by Vycto</Typography>
            </Box>
            <ColorSchemeToggle />
          </Box>
          <Box
            component="main"
            sx={{
              my: "auto",
              pb: 5,
              display: "flex",
              flexDirection: "column",
              gap: 2,
              width: 400,
              maxWidth: "100%",
              mx: "auto",
              borderRadius: "sm",
              "& form": {
                display: "flex",
                flexDirection: "column",
                gap: 2,
              },
              [`& .MuiFormLabel-asterisk`]: {
                visibility: "hidden",
              },
            }}
          >
            <div className="flex justify-center py-4">
              <Image
                src={siteData?.logo ?? "/logo.png"}
                width={100}
                height={100}
                alt="Site Logo"
                className="flex h-32 w-32 object-contain"
              />
            </div>
            <Stack sx={{ gap: 4, mb: emailExists ? 2 : 0 }}>
              <Stack sx={{ gap: 1 }}>
                {emailExists ? (
                  <Typography component="h1" level="h3">
                    Sign In & Play
                  </Typography>
                ) : (
                  <Typography component="h1" level="h3">
                    Bravo&nbsp; 🎉 &nbsp;Let the Competition begin!
                  </Typography>
                )}
              </Stack>
              {emailExists && (
                <Button
                  className="dark:bg-gray-800 dark:hover:bg-gray-700"
                  variant="soft"
                  color="neutral"
                  fullWidth
                  startDecorator={
                    <AppleIcon className="mr-2 text-2xl text-black dark:text-gray-200" />
                  }
                >
                  Continue with Apple
                </Button>
              )}
            </Stack>

            {emailExists ? (
              <Divider
                sx={(theme) => ({
                  [theme.getColorSchemeSelector("light")]: {
                    color: { xs: "#FFF", md: "text.tertiary" },
                  },
                })}
              >
                or
              </Divider>
            ) : (
              <Typography>
                Choose a username. This is what people will see on the
                leaderboard when you enter competitions.
              </Typography>
            )}

            <Stack sx={{ gap: 4, mt: emailExists ? 2 : 0 }}>
              <form>
                {emailExists ? (
                  <FormControl required>
                    <FormLabel>Email</FormLabel>
                    <input
                      id="email"
                      type="email"
                      autoComplete="email"
                      onChange={(e) => setEmail(e.target.value)}
                      className="mt-1 block w-full rounded-md border border-gray-300 py-1.5 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-700 dark:bg-gray-800"
                    />
                  </FormControl>
                ) : (
                  <>
                    <FormControl required>
                      <FormLabel>Username</FormLabel>
                      <input
                        id="username"
                        type="username"
                        autoComplete="username"
                        onChange={(e) => setUsername(e.target.value)}
                        className="mt-1 block w-full rounded-md border border-gray-300 px-2 py-1.5 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-700 dark:bg-gray-800"
                      />
                    </FormControl>
                    <FormControl>
                      <FormLabel>Full Name</FormLabel>
                      <input
                        id="fullname"
                        type="fullname"
                        autoComplete="fullname"
                        onChange={(e) => setName(e.target.value)}
                        className="mt-1 block w-full rounded-md border border-gray-300 px-2 py-1.5 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-700 dark:bg-gray-800"
                      />
                    </FormControl>
                  </>
                )}
                <Stack sx={{ gap: 4, mt: 2 }}>
                  <LoginButton
                    email={email}
                    username={username}
                    localAnswers={localAnswers}
                    competitionSlug={competitionSlug}
                    name={name}
                    setEmailExists={setEmailExists}
                  />
                  {emailExists && (
                    <p className="text-xs text-gray-500">
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
                </Stack>
              </form>
            </Stack>
          </Box>
          <Box component="footer" sx={{ py: 3 }}>
            <Typography level="body-xs" sx={{ textAlign: "center" }}>
              © Vycto {new Date().getFullYear()}
            </Typography>
          </Box>
        </Box>
      </Box>
      <Box
        sx={(theme) => ({
          height: "100%",
          position: "fixed",
          right: 0,
          top: 0,
          bottom: 0,
          left: { xs: 0, md: "50vw" },
          transition:
            "background-image var(--Transition-duration), left var(--Transition-duration) !important",
          transitionDelay: "calc(var(--Transition-duration) + 0.1s)",
          backgroundColor: "background.level1",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          backgroundImage: siteData?.loginBanner ?? "url(/loginBanner.png)",
          [theme.getColorSchemeSelector("dark")]: {
            backgroundImage:
              siteData?.loginBannerDark ?? "url(/loginBannerDark.png)",
          },
        })}
      />
    </CssVarsProvider>
  );
}
