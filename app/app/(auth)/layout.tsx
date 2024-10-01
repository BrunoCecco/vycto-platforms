import { Metadata } from "next";
import { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Login | Platforms Starter Kit",
};

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-w-screen flex min-h-screen flex-col justify-center">
      {children}
    </div>
  );
}
