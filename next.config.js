// /** @type {import('next').NextConfig} */
// const nextConfig = {
//   images: {
//     domains: ["img.freepik.com"],
//   },
// };

// export default nextConfig;

const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'img.freepik.com',
      },
      {
        protocol: 'https',
        hostname: 'encrypted-tbn0.gstatic.com',
      }
    ],
  },
  webpack(config, { dev, isServer }) {
    // Xử lý SVG
    const fileLoaderRule = config.module.rules.find((rule) =>
      rule.test?.test?.(".svg")
    );
    if (fileLoaderRule) {
      fileLoaderRule.exclude = /\.svg$/i;
    }

    config.module.rules.push({
      test: /\.svg$/i,
      issuer: /\.[jt]sx?$/,
      use: ["@svgr/webpack"],
    });
    
    // Vô hiệu hóa cache trong development
    if (dev) {
      config.cache = false;
    }
    
    return config;
  },
};

module.exports = nextConfig;


