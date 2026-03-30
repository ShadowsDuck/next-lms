import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  images: {
    remotePatterns: [
      {
        hostname: "next-learn-lms.t3.tigrisfiles.io",
        port: "",
        protocol: "https",
      },
    ],
  },
};

export default nextConfig;
