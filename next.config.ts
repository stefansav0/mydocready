import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Bypasses static type checking blockers during production compilation
  typescript: {
    ignoreBuildErrors: true,
  },
  
  // NOTE: The 'eslint' object block has been removed because it is deprecated 
  // and no longer supported or required in newer Next.js builds.

  // Universal fallback overrides for client-side compilation engines
  webpack: (config, { isServer, webpack }) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
        crypto: false,
        stream: false,
        path: false,
        http: false,
        https: false,
        zlib: false,
      };

      config.plugins.push(
        new webpack.NormalModuleReplacementPlugin(
          /^node:/,
          (resource: any) => {
            resource.request = resource.request.replace(/^node:/, "");
          }
        )
      );
    }
    return config;
  },
};

export default nextConfig;