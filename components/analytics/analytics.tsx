"use client";

import { useEffect, useRef } from "react";
import AnalyticsPage from "./analyticsPage";

const chartdata = [
  {
    date: "Jan 23",
    Visitors: 2890,
  },
  {
    date: "Feb 23",
    Visitors: 2756,
  },
  {
    date: "Mar 23",
    Visitors: 3322,
  },
  {
    date: "Apr 23",
    Visitors: 3470,
  },
  {
    date: "May 23",
    Visitors: 3475,
  },
  {
    date: "Jun 23",
    Visitors: 3129,
  },
];

const pages = [
  { name: "/platforms-starter-kit", value: 1230 },
  { name: "/vercel-is-now-bercel", value: 751 },
  { name: "/nextjs-conf", value: 471 },
  { name: "/150m-series-d", value: 280 },
  { name: "/about", value: 78 },
];

const referrers = [
  { name: "t.co", value: 453 },
  { name: "vercel.com", value: 351 },
  { name: "linkedin.com", value: 271 },
  { name: "google.com", value: 191 },
  {
    name: "news.ycombinator.com",
    value: 71,
  },
];

const countries = [
  { name: "United States of America", value: 789, code: "US" },
  { name: "India", value: 676, code: "IN" },
  { name: "Germany", value: 564, code: "DE" },
  { name: "United Kingdom", value: 234, code: "GB" },
  { name: "Spain", value: 191, code: "ES" },
];

const categories = [
  {
    title: "Top Pages",
    subtitle: "Page",
    data: pages,
  },
  {
    title: "Top Referrers",
    subtitle: "Source",
    data: referrers,
  },
  {
    title: "Countries",
    subtitle: "Country",
    data: countries,
  },
];

export default function Analytics({ posthogSrc }: { posthogSrc: string }) {
  useEffect(() => {
    window.addEventListener("message", (event) => {
      if (event.data.event === "posthog:dimensions") {
        // set posthogEmbed dimensions
        if (posthogEmbed.current) {
          posthogEmbed.current.style.height = `${event.data.height}px`;
        }
      }
    });
  }, []);

  const posthogEmbed = useRef<HTMLIFrameElement>(null);

  return (
    <div className="h-screen w-full">
      <iframe
        ref={posthogEmbed}
        width="100%"
        height="400"
        frameBorder="0"
        allowFullScreen
        src={posthogSrc}
      ></iframe>
      {/* <AnalyticsPage /> */}
    </div>
  );
}
