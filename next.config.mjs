/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['localhost'],
    dangerouslyAllowSVG: true,
    contentDispositionType: 'attachment',
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },
  webpack(config, options) {
    config.module.rules.push({
      test: /\.svg$/,
      issuer: { and: [/\.(js|ts|jsx|tsx)$/]},
      use: ['@svgr/webpack'],
    });

    return config;
  },
};

export default nextConfig;
