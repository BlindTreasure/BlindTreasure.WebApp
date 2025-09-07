// /** @type {import('next').NextConfig} */
// const nextConfig = {
//   images: {
//     domains: ["img.freepik.com"],
//   },
// };

// export default nextConfig;

const nextConfig = {
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
    
    // Loại bỏ dòng vô hiệu hóa cache để cải thiện performance
    
    return config;
  },
  // Thêm cấu hình image optimization
  images: {
    domains: ["img.freepik.com"],
    // Tối ưu hình ảnh
    formats: ['image/avif', 'image/webp'],
    // Sử dụng cache
    minimumCacheTTL: 60,
  },
  // Tăng tốc độ build
  swcMinify: true,
};

module.exports = nextConfig;


