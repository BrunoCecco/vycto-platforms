import Image from "next/image";
import { MoveUpRight } from "lucide-react";

const PastPredictions = () => {
  return (
    <div>
      <h2 className="flex flex-col justify-between text-6xl font-bold leading-tight sm:flex-row">
        <span className="sm:flex-1">PAST PREDICTIONS</span>
        <span className="w-full pb-3.5 text-right text-sm font-normal text-gray-400 sm:w-auto sm:self-end">
          powered by <span className="text-yellow-500">BINANCE</span>
        </span>
      </h2>

      {/* Past Predictions Content */}
      <div className="mt-8 space-y-6">
        {/* First Prediction */}
        <div className="group relative flex items-center gap-4 hover:cursor-pointer">
          <div className="relative h-36 w-36 overflow-hidden rounded-lg">
            <Image
              src="/player.png"
              alt="RAPID vs FCSB"
              fill
              objectFit="cover"
            />
          </div>
          <div>
            <h3 className="text-2xl font-semibold">RAPID vs FCSB</h3>
            <p className="text-gray-400">November 29</p>
          </div>

          {/* Arrow Icon in the top-right corner */}
          <MoveUpRight className="absolute right-2 top-2 h-6 w-6 transform text-red-500 transition-transform duration-300 group-hover:-translate-y-3 group-hover:translate-x-3" />
        </div>

        {/* Second Prediction */}
        <div className="group relative flex items-center gap-4 hover:cursor-pointer">
          <div className="relative h-36 w-36 overflow-hidden rounded-lg">
            <Image
              src="/player.png"
              alt="RAPID vs CFR Cluj"
              fill
              objectFit="cover"
            />
          </div>
          <div>
            <h3 className="text-2xl font-semibold">RAPID vs CFR Cluj</h3>
            <p className="text-gray-400">December 3</p>
          </div>
          {/* Arrow Icon in the top-right corner */}
          <MoveUpRight className="absolute right-2 top-2 h-6 w-6 transform text-red-500 transition-transform duration-300 group-hover:-translate-y-3 group-hover:translate-x-3" />
        </div>
      </div>
    </div>
  );
};

export default PastPredictions;
