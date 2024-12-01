import Image from "next/image";

const viewUnavailable = () => {
  return (
    <div className="relative mx-auto flex max-w-72 flex-col items-center justify-center rounded-lg bg-gradient-to-br from-[#868CFF] to-[#4318FF] p-6 text-center ">
      {/* V Logo Image */}
      <div className="relative -top-14 mb-2">
        <div className="h-20 w-20 rounded-full border-4 border-white bg-gradient-to-br from-[#868CFF] to-[#4318FF] p-4">
          <Image
            src="/vLogo.png"
            alt="V Logo"
            width={40}
            height={40}
            className="p-1"
          />
        </div>
      </div>

      {/* Powered by Text */}
      <div className="relative -top-8">
        <p className="font-semibold">
          Powered by{" "}
          <a href="#" className="underline">
            Vycto
          </a>
        </p>
        <p className="mt-2 text-sm">
          This feature is only available on larger screens.
        </p>
      </div>
    </div>
  );
};

export default viewUnavailable;
