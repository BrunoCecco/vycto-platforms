import { fontMapper } from "@/styles/fonts";
import { Metadata } from "next";
import { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Login | Platforms Starter Kit",
};

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div
      className={`${fontMapper["font-space"]} min-w-screen flex min-h-screen flex-col justify-center font-space`}
    >
      <div>{children}</div>
    </div>
  );
}
