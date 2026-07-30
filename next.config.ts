import type { NextConfig } from "next";
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
  // next-pwa injects webpack plugins; use `next build --webpack`
  turbopack: {},
};

export default withPWA(nextConfig);
