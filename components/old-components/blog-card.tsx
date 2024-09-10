import Link from "next/link";
import BlurImage from "./blur-image";
import { placeholderBlurhash, toDateString } from "@/lib/utils";
import type { SelectCompetition } from "@/lib/schema";

interface BlogCardProps {
  data: Pick<
    SelectCompetition,
    "slug" | "image" | "imageBlurhash" | "title" | "description" | "createdAt"
  >;
}

export default function BlogCard({ data }: BlogCardProps) {
  return (
    <Link href={`/comp/${data.slug}`}>
      <div className="ease overflow-hidden rounded-2xl border-stone-800 bg-white p-8 shadow-md transition-all duration-200 hover:-translate-y-1 hover:shadow-xl">
        <BlurImage
          src={data.image!}
          alt={data.title ?? "Blog Competition"}
          width={500}
          height={400}
          className="h-64 w-full rounded-2xl object-cover"
          placeholder="blur"
          blurDataURL={data.imageBlurhash ?? placeholderBlurhash}
        />
        <div className="h-36 border-t border-stone-200 px-5 py-8 dark:border-stone-700 dark:bg-black">
          <h3 className="font-title text-xl tracking-wide dark:text-white">
            {data.title}
          </h3>
          <p className="text-md my-2 truncate italic text-stone-600 dark:text-stone-400">
            {data.description}
          </p>
          <p className="my-2 text-sm text-stone-600 dark:text-stone-400">
            Published {toDateString(data.createdAt)}
          </p>
        </div>
      </div>
    </Link>
  );
}
