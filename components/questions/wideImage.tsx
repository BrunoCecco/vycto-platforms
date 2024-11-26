import Image from "next/image";

const makeTransparent = (color: string, opacity: number) => {
  // color is a hex string
  const hex = color.replace("#", "");
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${opacity})`;
};

export const WideImage = ({ src, color }: { src: string; color: string }) => {
  return (
    <div
      className="relative mb-4 flex h-44 w-full items-center justify-center overflow-hidden rounded-lg"
      style={{ backgroundColor: makeTransparent(color, 0.4) }}
    >
      <Image
        src={src ?? "/placeholder.png"}
        alt="Question Image"
        fill
        className="h-full w-full object-contain"
      />
    </div>
  );
};
