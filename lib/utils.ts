import { clsx, type ClassValue } from "clsx";
import { PgSelect } from "drizzle-orm/pg-core";
import { twMerge } from "tailwind-merge";
import { SelectSite, SelectUserCompetition } from "./schema";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
export async function fetcher<JSON = any>(
  input: RequestInfo,
  init?: RequestInit,
): Promise<JSON> {
  const response = await fetch(input, { ...init, cache: "no-store" });

  return response.json();
}

export const capitalize = (s: string) => {
  if (typeof s !== "string") return "";
  return s.charAt(0).toUpperCase() + s.slice(1);
};

export const truncate = (str: string, num: number) => {
  if (!str) return "";
  if (str.length <= num) {
    return str;
  }
  return str.slice(0, num) + "...";
};

export const getBlurDataURL = async (url: string | null) => {
  if (!url) {
    return "data:image/webp;base64,AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA=";
  }
  try {
    const response = await fetch(
      `https://wsrv.nl/?url=${url}&w=50&h=50&blur=5`,
    );
    const buffer = await response.arrayBuffer();
    const base64 = Buffer.from(buffer).toString("base64");

    return `data:image/png;base64,${base64}`;
  } catch (error) {
    return "data:image/webp;base64,AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA=";
  }
};

export const placeholderBlurhash =
  "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAAXNSR0IArs4c6QAAAoJJREFUWEfFl4lu4zAMRO3cx/9/au6reMaOdkxTTl0grQFCRoqaT+SQotq2bV9N8rRt28xms87m83l553eZ/9vr9Wpkz+ezkT0ej+6dv1X81AFw7M4FBACPVn2c1Z3zLgDeJwHgeLFYdAARYioAEAKJEG2WAjl3gCwNYymQQ9b7/V4spmIAwO6Wy2VnAMikBWlDURBELf8CuN1uHQSrPwMAHK5WqwFELQ01AIXdAa7XawfAb3p6AOwK5+v1ugAoEq4FRSFLgavfQ49jAGQpAE5wjgGCeRrGdBArwHOPcwFcLpcGU1X0IsBuN5tNgYhaiFFwHTiAwq8I+O5xfj6fOz38K+X/fYAdb7fbAgFAjIJ6Aav3AYlQ6nfnDoDz0+lUxNiLALvf7XaDNGQ6GANQBKR85V27B4D3QQRw7hGIYlQKWGM79hSweyCUe1blXhEAogfABwHAXAcqSYkxCtHLUK3XBajSc4Dj8dilAeiSAgD2+30BAEKV4GKcAuDqB4TdYwBgPQByCgApUBoE4EJUGvxUjF3Q69/zLw3g/HA45ABKgdIQu+JPIyDnisCfAxAFNFM0EFNQ64gfS0EUoQP8ighrZSjn3oziZEQpauyKbfjbZchHUL/3AS/Dd30gAkxuRACgfO+EWQW8qwI1o+wseNuKcQiESjALvwNoMI0TcRzD4lFcPYwIM+JTF5x6HOs8yI7jeB5oKhpMRFH9UwaSCDB2Jmg4rc6E2TT0biIaG0rQhNqyhpHBcayTTSXH6vcDL7/sdqRK8LkwTsU499E8vRcAojHcZ4AxABdilgrp4lsXk8oVqgwh7+6H3phqd8J0Kk4vbx/+sZqCD/vNLya/5dT9fAH8g1WdNGgwbQAAAABJRU5ErkJggg==";

export const toDateString = (date: Date) => {
  return new Date(date).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

export const random = (min: number, max: number) => {
  return Math.floor(Math.random() * (max - min + 1) + min);
};

export function withLimit<T extends PgSelect>(qb: T, limit: number) {
  return qb.limit(limit);
}

type NonNullableProps<T> = {
  [P in keyof T]: null extends T[P] ? never : P;
}[keyof T];

export function stripUndefined<T>(obj: T): Pick<T, NonNullableProps<T>> {
  const result = {} as T;
  for (const key in obj) if (obj[key] !== undefined) result[key] = obj[key];
  return result;
}

export const validateEmail = (email: string) => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

export const getSiteDomain = (siteData: SelectSite) => {
  // if (siteData.customDomain) {
  //   return siteData.customDomain;
  // }
  return (
    "http://" + siteData.subdomain + "." + process.env.NEXT_PUBLIC_ROOT_DOMAIN
  );
};

export const makeTransparent = (color: string, opacity: number) => {
  // color is a hex string
  const hex = color.replace("#", "");
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${opacity})`;
};

export const getLeaderboardName = (user: any) => {
  return (
    user.username?.split("@")[0] ||
    user.name ||
    user.email?.split("@")[0] ||
    "user" + user.userId.substring(0, 3)
  );
};

export const startOfWeek = new Date(
  new Date().getFullYear(),
  new Date().getMonth(),
  new Date().getDate() - 7,
);

export const endOfWeek = new Date(
  new Date().getFullYear(),
  new Date().getMonth(),
  new Date().getDate(),
);

export const startOfMonth = new Date(
  new Date().getFullYear(),
  new Date().getMonth(),
  1,
);

export const endOfMonth = new Date(
  new Date().getFullYear(),
  new Date().getMonth() + 1,
  0,
);

export const startOfSeason = new Date(new Date().getFullYear(), 0, 1);

export const endOfSeason = new Date(new Date().getFullYear(), 11, 31);

export const encodeAnswer = (answer: string) => {
  // replace + with PLUS and other characters that would be encoded with encodeURIComponent with their names
  return answer
    .replace(/\+/g, "vctoplusss")
    .replace(/\s/g, "spaceee")
    .replace(/!/g, "exclamation")
    .replace(/'/g, "apostrophe")
    .replace(/\(/g, "leftparen")
    .replace(/\)/g, "rightparen")
    .replace(/\*/g, "asterisk")
    .replace(/,/g, "commaaa")
    .replace(/\//g, "slashhh")
    .replace(/:/g, "colonn")
    .replace(/;/g, "semicolon")
    .replace(/\[/g, "leftbracket")
    .replace(/\]/g, "rightbracket");
};

export const decodeAnswer = (answer: string) => {
  return answer
    .replace(/plusss/g, "+")
    .replace(/spaceee/g, " ")
    .replace(/exclamation/g, "!")
    .replace(/apostrophe/g, "'")
    .replace(/leftparen/g, "(")
    .replace(/rightparen/g, ")")
    .replace(/asterisk/g, "*")
    .replace(/commaaa/g, ",")
    .replace(/slashhh/g, "/")
    .replace(/colonn/g, ":")
    .replace(/semicolon/g, ";")
    .replace(/leftbracket/g, "[")
    .replace(/rightbracket/g, "]");
};
