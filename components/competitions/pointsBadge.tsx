import { FC } from "react";

interface PointsBadgeProps {
  points: number;
  color?: string;
}

const makeTransparent = (color: string, opacity: number) => {
  // color is a hex string
  const hex = color.replace("#", "");
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${opacity})`;
};

const PointsBadge: FC<PointsBadgeProps> = ({ points, color }) => {
  return (
    <div
      className="absolute -right-6 -top-6 z-10 flex h-16 w-16 items-center justify-center rounded-full border-4 border-white text-lg font-bold"
      style={{
        backgroundColor: makeTransparent(color || "#FFFFFF", 0.6),
      }}
    >
      <div className="z-20 flex flex-col items-center ">
        <span className="text-xs">{points.toString().padStart(2, "0")}</span>
        <span className="-mt-1 text-xs font-normal">Points</span>
      </div>
    </div>
  );
};

export default PointsBadge;
