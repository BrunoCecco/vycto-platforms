import { FC } from "react";

interface PointsBadgeProps {
  points: number | null;
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
      className="absolute -right-6 -top-6 z-10 flex h-12 w-12 items-center justify-center rounded-full border font-bold sm:h-16 sm:w-16"
      style={{
        backgroundColor: makeTransparent(color || "#FFFFFF", 0.6),
      }}
    >
      <div className="z-20 flex flex-col items-center ">
        <span className="text-xs">{points?.toString() || 5}</span>
        <span className="-mt-1 hidden text-xs font-normal sm:block">
          Points
        </span>
        <span className="-mt-1 block text-xs font-normal sm:hidden">Pts</span>
      </div>
    </div>
  );
};

export default PointsBadge;
