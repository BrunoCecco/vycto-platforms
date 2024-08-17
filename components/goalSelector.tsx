import { FC } from "react";

// Define the types for the props
interface GoalSelectorProps {
  selectedOption: string;
  setSelectedOption: (option: string) => void;
  options: string[]; // New prop for the list of options
}

const GoalSelector: FC<GoalSelectorProps> = ({
  selectedOption,
  setSelectedOption,
  options, // Destructure options from props
}) => {
  return (
    <div className="flex items-center justify-between rounded-lg bg-gray-200 p-2">
      {options.map((option) => (
        <div
          key={option}
          className={`md:text-md cursor-pointer rounded-lg px-4 py-3 text-sm ${
            selectedOption === option
              ? "bg-white font-semibold text-blue-600 shadow-md"
              : ""
          }`}
          onClick={() => setSelectedOption(option)}
        >
          {option}
        </div>
      ))}
    </div>
  );
};

export default GoalSelector;
