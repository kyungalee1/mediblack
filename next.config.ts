import type { NextConfig } from "next";
import withPWAInit from "@ducanh2912/next-pwa";

const withPWA = withPWAInit({
  dest: "public",
  disable: process.env.NODE_ENV === "development",
  register: true,
  // Avoid document fallback to "/" — it can make new routes feel broken under SW
  workboxOptions: {
    skipWaiting: true,
    clientsClaim: true,
  },
});

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // next-pwa injects webpack plugins; use `next build --webpack`
  turbopack: {},
  async headers() {
    return [
      {
        source: "/manager",
        headers: [
          { key: "Cache-Control", value: "no-store, must-revalidate" },
        ],
      },
      {
        source: "/partner",
        headers: [
          { key: "Cache-Control", value: "no-store, must-revalidate" },
        ],
      },
    ];
  },
  async redirects() {
    return [
      // Common typos / aliases → canonical manager apply page
      { source: "/managers", destination: "/manager", permanent: false },
      { source: "/donghaeng", destination: "/manager", permanent: false },
      { source: "/apply-manager", destination: "/manager", permanent: false },
    ];
  },
};

export default withPWA(nextConfig);
