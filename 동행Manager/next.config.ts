import type { NextConfig } from "next";
import path from "path";
import withPWAInit from "@ducanh2912/next-pwa";

const withPWA = withPWAInit({
  dest: "public",
  disable: process.env.NODE_ENV === "development",
  register: true,
  fallbacks: {
    document: "/",
  },
});

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // Isolate this app from parent mediBlack lockfile inference
  outputFileTracingRoot: path.join(__dirname),
  // next-pwa injects webpack plugins; use `next build --webpack`
  turbopack: {},
};

export default withPWA(nextConfig);
