import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  output: "export",
  basePath: "/system-atlas",
  images: {
    unoptimized: true
  }
};

export default nextConfig;
