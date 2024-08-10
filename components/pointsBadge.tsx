import { FC } from "react";

interface PointsBadgeProps {
  points: number;
}

const PointsBadge: FC<PointsBadgeProps> = ({ points }) => {
  return (
    <div className="absolute -top-6 right-0 z-10 flex h-16 w-16 items-center justify-center rounded-full border-4 border-white bg-green-500 p-1 text-lg font-bold text-white">
      <div className="flex flex-col items-center">
        <span>{points.toString().padStart(2, "0")}</span>
        <span className="-mt-1 text-xs">Points</span>
      </div>
    </div>
  );
};

export default PointsBadge;
