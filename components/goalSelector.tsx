"use client";
import { useState } from "react";

const GoalSelector = () => {
  const [selected, setSelected] = useState("2 goals");

  const options = ["0 goals", "1 goal", "2 goals", "Hattrick!"];

  return (
    <div className="flex items-center justify-between rounded-lg bg-gray-200 p-2">
      {options.map((option) => (
        <div
          key={option}
          className={`md:text-md cursor-pointer rounded-lg px-4 py-3 text-sm ${
            selected === option
              ? "bg-white font-semibold text-blue-600 shadow-md"
              : ""
          }`}
          onClick={() => setSelected(option)}
        >
          {option}
        </div>
      ))}
    </div>
  );
};

export default GoalSelector;
