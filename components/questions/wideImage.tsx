import Image from "next/image";

export const WideImage = ({ src }: { src: string }) => {
  return (
    <div className="relative mb-4 flex h-44 w-full items-center justify-center overflow-hidden rounded-lg bg-green-100">
      <Image
        src={src ?? "/placeholder.png"}
        alt="Question Image"
        fill
        className="h-full w-full object-contain"
      />
    </div>
  );
};
