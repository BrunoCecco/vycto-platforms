"use client";
import { Suspense, useState } from "react";
import { signIn } from "next-auth/react";
import LoginButton from "./loginButton";
import UserSignUp from "@/components/userSignUp";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");

  return (
    // <div className="mx-5 rounded-md border border-stone-200 p-10 sm:mx-auto sm:w-full sm:max-w-md sm:rounded-lg sm:shadow-md dark:border-stone-400">
    <UserSignUp />
    //   <input
    //     type="email"
    //     id="email"
    //     name="email"
    //     placeholder="Email address"
    //     onChange={(e) => setEmail(e.target.value)}
    //     className="mt-1 block w-full rounded-md border border-stone-200 dark:border-stone-400"
    //   />
    //   <input
    //     type="text"
    //     id="username"
    //     name="username"
    //     placeholder="Username"
    //     onChange={(e) => setUsername(e.target.value)}
    //     className="mt-1 block w-full rounded-md border border-stone-200 dark:border-stone-400"
    //   />

    //   <Suspense
    //     fallback={
    //       <div className="my-2 h-10 w-full rounded-md border border-stone-200 bg-stone-100 dark:border-stone-700 dark:bg-stone-800" />
    //     }
    //   >
    // <LoginButton email={email} username={username} />
    //   </Suspense>
    // </div>
  );
}
