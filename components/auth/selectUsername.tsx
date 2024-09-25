"use client";

import Image from "next/image";
import { useState } from "react";

const SelectUsername = () => {
  const [username, setUsername] = useState("");

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUsername(e.target.value);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle the form submission (e.g., navigate to the next page or save the username)
  };

  return (
    <div className="flex flex-col items-center justify-center bg-white p-8">
      <div className="w-full max-w-lg text-left">
        <p className="text-xs text-gray-500">
          Powered by{" "}
          <span className="text-md font-bold text-blue-700">Vycto</span>
        </p>

        <div className="mt-6 flex flex-col items-center space-y-8">
          <Image
            src="/oakley.jpg"
            width={200}
            height={200}
            alt="Oakley Logo"
            className="h-20"
          />
          <h1 className="mt-4 text-lg font-bold text-blue-700 md:text-2xl">
            Bravo 🎉 Let the Competition begin!
          </h1>

          <p className="mt-2 text-gray-600">
            Choose a username. This is what people will see when you enter
            competitions and compete on the leaderboard.
          </p>

          <form onSubmit={handleSubmit} className="w-full space-y-10">
            <div className="text-left">
              <label
                htmlFor="username"
                className="block text-sm font-medium text-gray-700"
              >
                Username
              </label>
              <input
                id="username"
                type="text"
                value={username}
                onChange={handleInputChange}
                placeholder="Enter your username"
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              />
            </div>
            <button
              type="submit"
              className="w-full rounded-md border border-transparent bg-blue-700 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            >
              Next
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SelectUsername;
