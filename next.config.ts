import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Required to support TypeScript 7.x in Next.js 16
  experimental: {
    useTypeScriptCli: true,
  },
  
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