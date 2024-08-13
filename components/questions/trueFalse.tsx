import Image from "next/image";
import PointsBadge from "../pointsBadge";

const TrueFalse = ({
  question,
  points = 5,
}: {
  question: string;
  points: number;
}) => {
  return (
    <div className="flex items-center justify-center">
      <div className="relative h-full rounded-lg bg-white p-6 shadow-xl">
        {/* Points Badge */}
        <PointsBadge points={points} />

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
        <h2 className="mb-1 text-center text-xl font-semibold text-gray-800">
          {question}
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
