import type { NextConfig } from "next";
const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "localhost",
        port: "5000",
        pathname: "/uploads/**",
      },
      {
        protocol: "https",
        hostname: "**.onrender.com",
        pathname: "/uploads/**",
      },
      {
        protocol: "https",
        hostname: "**",
      },
    ],
    dangerouslyAllowSVG: true,
    dangerouslyAllowLocalIP: process.env.NODE_ENV !== "production",
  },
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: "https://crm-backend-roan.vercel.app/api/:path*",
      },
      {
        source: "/uploads/:path*",
        destination: "https://crm-backend-roan.vercel.app/uploads/:path*", // <-- Yeh line lazmi add karein taake images proxy ho saken
      },
    ];
  },
};
export default nextConfig;
