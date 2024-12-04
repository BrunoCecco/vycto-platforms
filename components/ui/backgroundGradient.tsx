"use client";
import { cn } from "@/lib/utils";
import React from "react";
import { motion } from "framer-motion";

export const BackgroundGradient = ({
  children,
  className,
  containerClassName,
  animate = true,
  color1 = "#00ccb1",
  color2 = "#7b61ff",
  color3 = "#ffc414",
  color4 = "#1ca0fb",
  color5 = "#141316",
}: {
  children?: React.ReactNode;
  className?: string;
  containerClassName?: string;
  animate?: boolean;
  color1?: string;
  color2?: string;
  color3?: string;
  color4?: string;
  color5?: string;
}) => {
  const variants = {
    initial: {
      backgroundPosition: "0 50%",
    },
    animate: {
      backgroundPosition: ["0, 50%", "100% 50%", "0 50%"],
    },
  };
  return (
    <div className={cn("group relative z-0 p-[4px]", containerClassName)}>
      <motion.div
        variants={animate ? variants : undefined}
        initial={animate ? "initial" : undefined}
        animate={animate ? "animate" : undefined}
        transition={
          animate
            ? {
                duration: 5,
                repeat: Infinity,
                repeatType: "reverse",
              }
            : undefined
        }
        style={{
          backgroundSize: animate ? "400% 400%" : undefined,
          backgroundImage: `radial-gradient(circle farthest-side at 0 100%, ${color1}, transparent), radial-gradient(circle farthest-side at 100% 0, ${color2}, transparent), radial-gradient(circle farthest-side at 100% 100%, ${color3}, transparent), radial-gradient(circle farthest-side at 0 0, ${color4}, ${color5})`,
        }}
        className={cn(
          "absolute inset-0 z-[1] rounded-xl opacity-60 blur-xl transition  duration-500 will-change-transform group-hover:opacity-100",
          // " bg-[radial-gradient(circle_farthest-side_at_0_100%,#00ccb1,transparent),radial-gradient(circle_farthest-side_at_100%_0,#7b61ff,transparent),radial-gradient(circle_farthest-side_at_100%_100%,#ffc414,transparent),radial-gradient(circle_farthest-side_at_0_0,#1ca0fb,#141316)]",
        )}
      />
      <motion.div
        variants={animate ? variants : undefined}
        initial={animate ? "initial" : undefined}
        animate={animate ? "animate" : undefined}
        transition={
          animate
            ? {
                duration: 5,
                repeat: Infinity,
                repeatType: "reverse",
              }
            : undefined
        }
        style={{
          backgroundSize: animate ? "400% 400%" : undefined,
          // emulate circle radial gradient for browsers that don't support tailwindcss
          backgroundImage: `radial-gradient(circle farthest-side at 0 100%, ${color1}, transparent), radial-gradient(circle farthest-side at 100% 0, ${color2}, transparent), radial-gradient(circle farthest-side at 100% 100%, ${color3}, transparent), radial-gradient(circle farthest-side at 0 0, ${color4}, ${color5})`,
        }}
        className={cn(
          "absolute inset-0 z-[1] rounded-xl will-change-transform",
          // "bg-[radial-gradient(circle_farthest-side_at_0_100%,#00ccb1,transparent),radial-gradient(circle_farthest-side_at_100%_0,#7b61ff,transparent),radial-gradient(circle_farthest-side_at_100%_100%,#ffc414,transparent),radial-gradient(circle_farthest-side_at_0_0,#1ca0fb,#141316)]",
        )}
      />

      <div className={cn("relative z-10", className)}>{children}</div>
    </div>
  );
};
