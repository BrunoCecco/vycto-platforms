"use client";

import { SelectSite } from "@/lib/schema";
import Image from "next/image";

const SignUpWrapper = ({
  siteData,
  children,
}: {
  siteData?: SelectSite;
  children: React.ReactNode;
}) => {
  return (
    <div className="flex min-h-screen flex-col md:flex-row">
      <div className="relative z-30 mx-auto flex h-screen w-full max-w-lg flex-col items-center justify-center p-8 backdrop-blur-2xl backdrop-opacity-100 md:w-1/2">
        {children}
      </div>

      {/* Right side - Logo and Info */}
      <div className="fixed z-20 flex h-screen w-full flex-col items-center justify-center overflow-hidden bg-[#543ccc]  md:relative md:w-1/2">
        <div className="flex h-1/2 flex-col items-center justify-between">
          <Image src={"/vLogo.png"} width={75} height={75} alt={""} />
          <div className="flex items-center justify-center">
            <Image src={"/vyctoLogo.png"} width={110} height={110} alt={""} />
            <span className="ml-3 rounded-lg border-2 border-[#FFC700] p-1 text-sm font-medium text-[#FFC700]">
              beta
            </span>
          </div>
          <div className="rounded-lg border-2  bg-gradient-to-br from-[#868CFF] to-[#4318FF] px-12 py-4 text-center  shadow-lg">
            <p className="text-lg">Learn more about vycto on</p>
            <a href="https://vycto.tech" className="text-2xl font-semibold">
              vycto.tech
            </a>
          </div>
        </div>
        {/* <div className="absolute bottom-6 space-x-10 text-sm ">
          <a href="#">Product</a>
          <a href="#">Mission</a>
          <a href="#">Contact</a>
        </div> */}
        {/* Curve effect */}
        <div className="absolute bottom-0 left-0 h-28 w-28 ">
          <div className="h-28 w-28 rounded-bl-full bg-[#543ccc]"></div>
        </div>
      </div>
    </div>
  );
};

export default SignUpWrapper;
