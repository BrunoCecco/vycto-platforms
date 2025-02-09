import { Calendar, CheckCircle2, ArrowRight, Flame } from "lucide-react";

const Retention = () => {
  return (
    <div className="h-full w-full rounded-2xl  p-6 shadow-lg">
      <div className="flex">
        <div>
          <div className="flex items-center justify-between pb-4">
            <div className="flex items-center space-x-4">
              <Calendar size={28} color="#6C63FF" />
              <span className="text-lg font-medium">Retention</span>
            </div>
          </div>

          {/* Left Column */}
          <div className="flex flex-col space-y-6">
            <div className="flex items-center space-x-2">
              <CheckCircle2 size={28} className="text-emerald-400" />
              <div>
                <h3 className="font-semibold">Participant Growth</h3>
                <span className="text-sm ">March</span>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <ArrowRight size={28} className="text-blue-500" />
              <div>
                <h3 className="font-semibold">Fan Retention</h3>
                <span className="text-sm ">March</span>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Flame size={28} className="text-danger-500" />
              <div>
                <h3 className="font-semibold">Word of Mouth</h3>
                <span className="text-sm ">March</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Section (Grid) */}
        <div className="grid w-2/3 grid-cols-3 justify-evenly">
          {/* Column Titles */}
          <span className="text-center ">Growth</span>
          <span className="text-center ">March</span>
          <span className="text-center ">April</span>

          {/* Participant Growth Data */}
          <span className="text-center text-lg font-semibold text-emerald-500">
            + 35%
          </span>
          <span className="text-center ">3.2K</span>
          <div className="flex justify-center">
            <span className="text-success-500">4.1K</span>
          </div>

          {/* Fan Retention Data */}
          <span className="text-center text-lg font-semibold text-emerald-500">
            + 13%
          </span>
          <span className="text-center ">570</span>
          <div className="flex justify-center">
            <span className="text-success-500">690</span>
          </div>

          {/* Word of Mouth Data */}
          <span className="text-center text-lg font-semibold text-danger-500">
            - 2.3%
          </span>
          <span className="text-center ">132</span>
          <div className="flex justify-center">
            <span className="text-danger-500">127</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Retention;
