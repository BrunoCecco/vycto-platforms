import Image from "next/image";

const ProfileCard = () => {
  return (
    <div className="relative flex w-full flex-col items-center rounded-lg bg-white p-6  shadow-md">
      {/* Image */}
      <div className="relative h-60 w-52 overflow-hidden rounded-lg">
        <Image
          src="/player.png"
          alt="Profile picture"
          layout="fill"
          objectFit="cover"
          className="rounded-lg"
        />
      </div>

      {/* Username */}
      <h1 className="mt-4 text-center text-xl font-bold">@BRUNO9</h1>

      {/* Quote */}
      <p className="mt-4 text-center italic">
        &lsquo;play to win or don&apos;t play at all&rsquo;
      </p>

      {/* Logos */}
      <div className="mt-4 flex justify-center gap-4">
        <div className="relative h-10 w-10">
          <Image
            src="/player.png"
            alt="Team logo"
            fill
            className="rounded-full object-cover"
          />
        </div>
        <div className="relative h-10 w-10">
          <Image
            src="/player.png"
            alt="Team logo"
            fill
            className="rounded-full object-cover"
          />
        </div>
        <div className="relative h-10 w-10">
          <Image
            src="/player.png"
            alt="Team logo"
            fill
            className="rounded-full object-cover"
          />
        </div>
      </div>
    </div>
  );
};

export default ProfileCard;
