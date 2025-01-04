"use client";
import { useEffect } from "react";

import useFluidCursor from "@/lib/hooks/useFluidCursor";

const FluidCursor = () => {
  useEffect(() => {
    useFluidCursor();
  }, []);

  return (
    <div className="z-2 fixed left-0 top-0">
      <canvas id="fluid" className="h-screen w-screen" />
    </div>
  );
};
export default FluidCursor;
