import Image from "next/image";

const PredictionStats = () => {
  return (
    <>
      {/* User Stats */}
      <div className="text-center lg:text-left">
        <h1 className="text-4xl font-bold">@BRUN09</h1>
        <div className="mt-12 flex flex-col items-center justify-between gap-4 sm:flex-row sm:items-start">
          <div className="text-5xl font-bold">
            12.3K
            <p className="text-sm font-normal text-gray-400">points</p>
          </div>
          <div className="text-5xl font-bold">
            13
            <p className="text-sm font-normal text-gray-400">victories</p>
          </div>
          <div className="text-5xl font-bold">
            1<p className="text-sm font-normal text-gray-400">mvp</p>
          </div>
        </div>
      </div>

      {/* Top Predictions Section */}
      <div className="mt-12">
        <h2 className="text-2xl font-bold">
          top predictions{" "}
          <span className="font-normal text-gray-400">powered by</span>{" "}
          <span className="text-red-500">Superbet</span>
        </h2>
        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="relative h-40 w-full overflow-hidden rounded-lg bg-gray-800">
            <Image
              src="/player.png"
              alt="Prediction 3-0"
              layout="fill"
              objectFit="cover"
            />
            <span className="absolute left-2 top-2 text-lg font-bold text-white">
              3 - 0
            </span>
          </div>
          <div className="relative h-40 w-full overflow-hidden rounded-lg bg-gray-800">
            <Image
              src="/player.png"
              alt="Prediction 5-2"
              layout="fill"
              objectFit="cover"
            />
            <span className="absolute left-2 top-2 text-lg font-bold text-white">
              5 - 2
            </span>
          </div>
        </div>
      </div>
    </>
  );
};
export default PredictionStats;
