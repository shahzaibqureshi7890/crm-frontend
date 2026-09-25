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
      // Cloudinary ke liye official aur secure pattern
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
        pathname: "/**",
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
        destination: "https://crm-backend-roan.vercel.app/uploads/:path*",
      },
    ];
  },
};
export default nextConfig;
