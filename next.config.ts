import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  
  // Excluir carpeta docs del build
  typescript: {
    ignoreBuildErrors: false,
  },
  
  // Configuración de Turbopack
  experimental: {
    turbo: {
      resolveAlias: {
        // Alias personalizados si los necesitas
      },
    },
  },

  // Webpack config para excluir docs
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
      };
    }
    
    // Excluir archivos de docs
    config.module = config.module || {};
    config.module.rules = config.module.rules || [];
    config.module.rules.push({
      test: /docs\//,
      loader: 'ignore-loader',
    });

    return config;
  },
};

export default nextConfig;
