const { hostname } = require("os");

/**
 * @type {import('next').NextConfig}
 */
module.exports = {
  reactStrictMode: false,
  experimental: {
    serverActions: {
      allowedOrigins: ["app.localhost:3000"],
    },
  },
  images: {
    remotePatterns: [
      { hostname: "lh3.googleusercontent.com" },
      { hostname: "public.blob.vercel-storage.com" },
      { hostname: "zceacfu28qvfxul0.public.blob.vercel-storage.com" },
      { hostname: "res.cloudinary.com" },
      { hostname: "abs.twimg.com" },
      { hostname: "pbs.twimg.com" },
      { hostname: "avatar.vercel.sh" },
      { hostname: "avatars.githubusercontent.com" },
      { hostname: "www.google.com" },
      { hostname: "flag.vercel.app" },
      { hostname: "illustrations.popsy.co" },
      { hostname: "www.sofascore.com" },
      { hostname: "api.sofascore.com" },
      { hostname: "vyctorewards.com" },
      { hostname: "vycto.com" },
      { hostname: "app.vyctorewards.com" },
      { hostname: "images.unsplash.com" },
      { hostname: "f005.backblazeb2.com" },
    ],
  },
};
