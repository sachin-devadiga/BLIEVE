import type { NextConfig } from "next";

const API_ORIGIN = "https://api.blieve.in";

const nextConfig: NextConfig = {
  async rewrites() {
    return {
      beforeFiles: [
        {
          source: "/api/:path*",
          destination: `${API_ORIGIN}/api/:path*`,
        },
      ],
    };
  },
};

export default nextConfig;
