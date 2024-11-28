import localFont from "next/font/local";
import { Inter, Lora, Work_Sans, Space_Grotesk } from "next/font/google";

export const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const spaceGrotesk = Space_Grotesk({
  variable: "--font-space",
  subsets: ["latin"],
  preload: true,
});

export const cal = localFont({
  src: "./CalSans-SemiBold.otf",
  variable: "--font-cal",
  weight: "600",
  display: "swap",
  preload: true,
});

export const calTitle = localFont({
  src: "./CalSans-SemiBold.otf",
  variable: "--font-title",
  weight: "600",
  display: "swap",
  preload: true,
});

export const lora = Lora({
  variable: "--font-title",
  subsets: ["latin"],
  weight: "600",
  display: "swap",
  preload: true,
});
export const work = Work_Sans({
  variable: "--font-title",
  subsets: ["latin"],
  weight: "600",
  display: "swap",
  preload: true,
});

export const fontMapper = {
  "font-cal": calTitle.variable,
  "font-lora": lora.variable,
  "font-work": work.variable,
  "font-space": spaceGrotesk.variable,
} as Record<string, string>;
