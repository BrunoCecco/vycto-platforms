"use client";

import { Button, Input } from "@nextui-org/react";
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
    <div className="mt-6 flex flex-col items-center space-y-8">
      <h1 className="mt-4 text-lg font-bold text-blue-700 md:text-2xl">
        Bravo 🎉 Let the Competition begin!
      </h1>

      <p className="mt-2 ">
        Choose a username. This is what people will see when you enter
        competitions and compete on the leaderboard.
      </p>

      <form onSubmit={handleSubmit} className="w-full space-y-10">
        <div className="text-left">
          <label htmlFor="username" className="block text-sm font-medium ">
            Username
          </label>
          <Input
            id="username"
            type="text"
            value={username}
            onChange={handleInputChange}
            placeholder="Enter your username"
          />
        </div>
        <Button type="submit">Next</Button>
      </form>
    </div>
  );
};

export default SelectUsername;
