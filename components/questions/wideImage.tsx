import Image from "next/image";
import { makeTransparent } from "@/lib/utils";

export const WideImage = ({
  src,
  color,
}: {
  src: string | null;
  color: string;
}) => {
  return (
    <div
      className="relative mb-4 flex h-24 w-full items-center justify-center overflow-hidden rounded-lg sm:h-44"
      style={{ backgroundColor: makeTransparent(color, 0.4) }}
    >
      <Image
        src={src || "/placeholder.png"}
        alt="Question Image"
        fill
        unoptimized
        className="h-full w-full object-cover"
      />
    </div>
  );
};
