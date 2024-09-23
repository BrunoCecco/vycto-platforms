"use client";
import Image from "next/image";
import { signIn } from "next-auth/react";
import { useState } from "react";
import { SelectSite } from "@/lib/schema";
import LoginButton from "./loginButton";

const UserSignUp = ({ siteData }: { siteData?: SelectSite }) => {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [name, setName] = useState("");

  return (
    <div className="flex flex-col items-center justify-center bg-white p-8">
      <div className="w-full max-w-lg text-left">
        <p className="text-xs text-gray-500">
          powered by{" "}
          <span className="text-md font-bold text-blue-700">Vycto</span>
        </p>

        <div className="mt-6 flex flex-col items-center">
          <Image
            src={siteData?.logo ?? "/logo.png"}
            width={100}
            height={100}
            alt="Oakley Logo"
            className="object-contain"
          />
          <h1 className="mt-4 text-2xl font-bold text-blue-700">
            Sign Up & Play
          </h1>

          <div className="mt-6 flex w-full space-x-4">
            <button
              onClick={() => signIn("apple")}
              className="flex w-1/2 items-center justify-center rounded-md border border-gray-300 bg-gray-100 p-4 text-sm font-medium text-gray-700 shadow-sm"
            >
              <Image
                src="/appleIcon.svg"
                width={20}
                height={20}
                alt="Apple Logo"
                className="mr-2 h-5 w-5"
              />
              <span>Continue with Apple</span>
            </button>
            <button
              onClick={() => signIn("facebook")}
              className="flex w-1/2 items-center justify-center rounded-md border border-gray-300 bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700 shadow-sm"
            >
              <Image
                src="/facebookIcon.svg"
                width={20}
                height={20}
                alt="Facebook Logo"
                className="mr-2 h-5 w-5"
              />
              <span>Continue with Facebook</span>
            </button>
          </div>

          <p className="my-4 text-gray-400">or</p>

          <form className="w-full space-y-4">
            <div className="flex space-x-4">
              <input
                type="text"
                placeholder="Full Name"
                onChange={(e) => setName(e.target.value)}
                className="block w-full rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              />
            </div>
            <div>
              <label
                htmlFor="username"
                className="block text-sm font-medium text-gray-700"
              >
                Username
              </label>
              <input
                id="username"
                type="username"
                placeholder="username"
                onChange={(e) => setUsername(e.target.value)}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              />
            </div>
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700"
              >
                Email Address
              </label>
              <input
                id="email"
                type="email"
                placeholder="buzz@lightyear.com"
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              />
            </div>
            {/* <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700"
              >
                Password
              </label>
              <input
                id="password"
                type="password"
                placeholder="Password"
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              />
            </div> */}
            <LoginButton email={email} username={username} name={name} />
          </form>
        </div>

        <p className="mt-4 text-center text-xs text-gray-500">
          By continuing you agree to the{" "}
          <span className="font-semibold text-gray-800">Terms of use</span> and
          Privacy Policy
        </p>
      </div>
    </div>
  );
};

export default UserSignUp;
