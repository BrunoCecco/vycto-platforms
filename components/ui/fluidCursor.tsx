"use client";
import { useEffect } from "react";

import fluidCursor from "@/lib/hooks/useFluidCursor";

const FluidCursor = ({ color }: { color: string }) => {
  useEffect(() => {
    fluidCursor(color);
  }, []);

  return (
    <div className="z-2 fixed left-0 top-0">
      <canvas id="fluid" className="h-screen w-screen" />
    </div>
  );
};
export default FluidCursor;
