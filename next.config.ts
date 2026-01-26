import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  devIndicators: false,
  output: 'export',  // <--- Esta línea es clave
  images: {
    unoptimized: true, // GitHub Pages no soporta la optimización de imágenes nativa de Next.js
  },
};

export default nextConfig;
