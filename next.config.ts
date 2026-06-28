import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Only this host is allowed; next/image rejects un-whitelisted remotes by design.
    remotePatterns: [{ protocol: "https", hostname: "images.unsplash.com" }],
  },
};

export default nextConfig;
