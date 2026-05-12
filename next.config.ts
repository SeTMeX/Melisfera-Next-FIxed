import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Folosim webpack standard în loc de Turbopack
  allowedDevOrigins: ['192.168.0.6'],
};

export default nextConfig;