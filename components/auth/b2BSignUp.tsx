"use client";
import { Eye, EyeOff } from "lucide-react";
import Image from "next/image";
import React, { useState } from "react";
import LoginButton from "./loginButton";
import SignUpWrapper from "./signUpWrapper";

const B2BSignUp: React.FC = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [emailExists, setEmailExists] = useState(true);

  return (
    <SignUpWrapper>
      <div className="mx-auto w-full">
        <h2 className="mb-6 text-3xl font-bold ">Sign In</h2>
        {/* <p className="mb-8 ">
            Enter your email and password to sign in!
          </p>
          <button className="mb-6 flex w-full items-center justify-center gap-2 rounded-md border border-gray-300 py-2  shadow-sm hover:bg-gray-50">
            <Image src={"/googleIcon.svg"} width={20} height={20} alt={""} />
            Sign in with Google
          </button>
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="bg-white px-2 ">or</span>
            </div>
          </div> */}
        <div className="space-y-6">
          {/* Email Field */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium ">
              Email <span>*</span>
            </label>
            <div className="mt-1">
              <input
                id="email"
                name="email"
                type="email"
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
                placeholder="mail@simple.com"
                required
                className="border-gray-300 placeholder-gray-400 focus:border-blue-500 focus:ring-blue-500 block w-full appearance-none rounded-lg border px-3 py-2 shadow-sm focus:outline-none sm:text-sm"
              />
            </div>
            {!emailExists && (
              <div>
                <p className="mt-2 text-center text-sm ">
                  Welcome! Please choose a username.
                </p>
                <label
                  htmlFor="username"
                  className="block text-sm font-medium "
                >
                  Username
                </label>
                <div className="mt-1">
                  <input
                    id="username"
                    name="username"
                    type="text"
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="user123"
                    required
                    className="border-gray-300 placeholder-gray-400 focus:border-blue-500 focus:ring-blue-500 block w-full appearance-none rounded-lg border px-3 py-2 shadow-sm focus:outline-none sm:text-sm"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Password Field */}
          {/* <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium "
              >
                Password <span>*</span>
              </label>
              <div className="relative mt-1">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  placeholder="Min. 8 characters"
                  required
                  className="block w-full appearance-none rounded-lg border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 flex items-center pr-3 text-sm leading-5"
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5 " />
                  ) : (
                    <Eye className="h-5 w-5 " />
                  )}
                </button>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 rounded border-gray-300 text-blue-600"
                />
                <label
                  htmlFor="remember-me"
                  className="ml-2 block text-sm "
                >
                  Keep me logged in
                </label>
              </div>
              <div className="text-sm">
                <a
                  href="#"
                  className="font-medium text-blue-600 hover:text-blue-500"
                >
                  Forgot password?
                </a>
              </div>
            </div> */}
          <LoginButton
            email={email}
            setEmailExists={setEmailExists}
            username={username}
          />
        </div>
      </div>
    </SignUpWrapper>
  );
};

export default B2BSignUp;
