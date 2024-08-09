import Image from "next/image";
import { FC } from "react";

const TrueFalse: FC = () => {
  return (
    <div className="flex items-center justify-center">
      <div className="relative h-full rounded-lg bg-white p-6 shadow-xl">
        {/* Points Badge */}
        <div className="absolute -top-6 right-0 z-10 flex h-16 w-16 items-center justify-center rounded-full border-4 border-white bg-green-500 text-lg font-bold text-white">
          <div className="flex flex-col items-center">
            <span>05</span>
            <span className="-mt-1 text-xs">Points</span>
          </div>
        </div>

        {/* Placeholder for Image or Graphic */}
        <div className="mb-4 h-32 w-full overflow-hidden rounded-lg bg-green-100">
          <Image
            src={"/trueFalse.jpg"}
            alt="True or False Image"
            layout="responsive"
            width={500}
            height={200}
            objectFit="cover"
            className="rounded-lg"
          />
        </div>

        {/* Question */}
        <h2 className="mb-2 text-center text-xl font-semibold text-gray-800">
          Antoine Griezmann will score a goal
        </h2>
        <p className="mb-6 text-center text-gray-500">
          Select correctly to score points
        </p>

        <div className="flex justify-around">
          <button className="mx-2 w-32 rounded-full border-2 border-red-500 bg-green-500 p-2 font-semibold italic text-white shadow-lg hover:bg-green-600">
            True
          </button>
          <button className="mx-2 w-32 rounded-full border-2 border-gray-300 bg-white p-2 font-semibold italic text-gray-500 shadow-lg hover:bg-gray-100">
            False
          </button>
        </div>
      </div>
    </div>
  );
};

export default TrueFalse;
