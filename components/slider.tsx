import { useState } from "react";
import { Range } from "react-range";

const Slider = () => {
  const [values, setValues] = useState([63]);
  const MIN = 0;
  const MAX = 90;

  return (
    <div className="w-full px-4 py-6">
      <div className="flex items-center justify-center space-x-4">
        <span className="text-sm text-gray-600">{MIN}</span>
        <Range
          step={1}
          min={MIN}
          max={MAX}
          values={values}
          onChange={(values) => setValues(values)}
          renderTrack={({ props, children }) => (
            <div
              {...props}
              className="h-2 w-full rounded-full bg-gray-200"
              style={{ position: "relative" }}
            >
              <div
                className="h-2 rounded-full bg-green-500"
                style={{
                  position: "absolute",
                  left: "0",
                  right: `${100 - ((values[0] - MIN) / (MAX - MIN)) * 100}%`,
                }}
              />
              {children}
            </div>
          )}
          renderThumb={({ props }) => (
            <div
              {...props}
              className="flex h-8 w-8 items-center justify-center rounded-full border border-gray-300 bg-gray-200 shadow-md"
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <span className="text-xs font-bold text-blue-600">
                {values[0]}
              </span>
            </div>
          )}
        />
        <span className="text-sm font-bold text-black">{MAX}</span>
      </div>
    </div>
  );
};

export default Slider;
