import Image from "next/image";

export default function NotFoundSite() {
  return (
    <div className="mt-20 flex flex-col items-center space-x-4">
      <h1 className="text-4xl">404</h1>
      <Image
        alt="missing site"
        src="/logo.png"
        width={400}
        height={400}
        className="dark:hidden"
      />
      <Image
        alt="missing site"
        src="/logo.png"
        width={400}
        height={400}
        className="hidden dark:block"
      />
      <p className="text-lg ">
        Site does not exist, or you do not have permission to view it
      </p>
    </div>
  );
}
