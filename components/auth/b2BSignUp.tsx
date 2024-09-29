"use client";
import { Eye, EyeOff } from "lucide-react";
import Image from "next/image";
import React, { useState } from "react";
import LoginButton from "./loginButton";

const B2BSignUp: React.FC = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");

  return (
    <div className="flex min-h-screen">
      {/* Left side - Sign In form */}
      <div className="flex w-1/2 flex-col justify-center bg-white px-16">
        <div className="mx-auto w-full max-w-md">
          <h2 className="mb-6 text-3xl font-bold text-gray-900">Sign In</h2>
          {/* <p className="mb-8 text-gray-600">
            Enter your email and password to sign in!
          </p>
          <button className="mb-6 flex w-full items-center justify-center gap-2 rounded-md border border-gray-300 py-2 text-gray-700 shadow-sm hover:bg-gray-50">
            <Image src={"/googleIcon.svg"} width={20} height={20} alt={""} />
            Sign in with Google
          </button>
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="bg-white px-2 text-gray-500">or</span>
            </div>
          </div> */}
          <div className="space-y-6">
            <div>
              <label
                htmlFor="username"
                className="block text-sm font-medium text-gray-700"
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
                  className="block w-full appearance-none rounded-lg border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm"
                />
              </div>
            </div>
            {/* Email Field */}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700"
              >
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
                  className="block w-full appearance-none rounded-lg border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm"
                />
              </div>
            </div>

            {/* Password Field */}
            {/* <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700"
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
                    <EyeOff className="h-5 w-5 text-gray-500" />
                  ) : (
                    <Eye className="h-5 w-5 text-gray-500" />
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
                  className="ml-2 block text-sm text-gray-900"
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
            <LoginButton email={email} username={username} />
          </div>
          {/* <div className="mt-6 text-center">
            <p className="text-gray-600">
              Not registered yet?{" "}
              <a
                href="#"
                className="font-medium text-blue-600 hover:text-blue-500"
              >
                Create an Account
              </a>
            </p>
          </div> */}
        </div>
      </div>

      {/* Right side - Logo and Info */}
      <div className="relative flex w-1/2 flex-col items-center justify-center overflow-hidden bg-[#543ccc] text-white">
        <div className="flex h-1/2 flex-col items-center justify-between">
          <Image src={"/vLogo.png"} width={75} height={75} alt={""} />
          <div className="flex items-center justify-center">
            <Image src={"/vyctoLogo.png"} width={110} height={110} alt={""} />
            <span className="text-md ml-3 rounded-lg border-2 border-[#FFC700] p-1 font-medium text-[#FFC700]">
              beta
            </span>
          </div>
          <div className="rounded-lg border-2 border-gray-400 bg-gradient-to-br from-[#868CFF] to-[#4318FF] px-12 py-4 text-center text-white shadow-lg">
            <p className="text-lg">Learn more about vycto on</p>
            <a href="https://vycto.com" className="text-2xl font-semibold">
              vycto.com
            </a>
          </div>
        </div>

        <div className="absolute bottom-6 space-x-10 text-sm text-white">
          <a href="#">Product</a>
          <a href="#">Mission</a>
          <a href="#">Contact</a>
        </div>

        {/* Curve effect */}
        <div className="absolute bottom-0 left-0 h-28 w-28 bg-white">
          <div className="h-28 w-28 rounded-bl-full bg-[#543ccc]"></div>
        </div>
      </div>
    </div>
  );
};

export default B2BSignUp;
