import React, { useState } from "react";

const Toggle = ({
  id,
  key,
  isSelected,
  onToggle,
  label,
}: {
  id: string;
  key: string;
  isSelected: boolean;
  onToggle?: (toggled: boolean) => void;
  label?: string;
}) => {
  const [toggled, setToggled] = useState(isSelected);

  const handleToggle = () => {
    const newState = !toggled;
    setToggled(newState);
    if (onToggle) {
      onToggle(newState);
    }
  };

  return (
    <div className="flex items-center">
      <div
        id={id}
        key={key}
        className={
          "relative h-[20px] w-[50px] translate-x-1 translate-y-1 cursor-pointer rounded-md bg-foreground"
        }
        onClick={handleToggle}
      >
        <span
          className={`flex h-full w-full translate-x-[3px] translate-y-[-3px] items-center justify-center rounded-md border-[2px] ${toggled ? " bg-primary" : " bg-content3"} transition-all duration-300`}
        >
          <span
            className={`h-[20px] w-[20px] transform rounded-md border-[2px] bg-background shadow-lg ${toggled ? "translate-x-[15px]" : "translate-x-[-15px]"} transition-all duration-300`}
          />
        </span>
      </div>
      <div className="ml-4">{label}</div>
    </div>
  );
};

export default Toggle;
