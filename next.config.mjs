/** @type {import('next').NextConfig} */

const nextConfig = {
  experimental: {
    serverComponentsExternalPackages: ["graphql"],
  },
  env: {
    REACT_APP_AUTH0_DOMAIN: "dev-spxf3pmvngdhjouv.us.auth0.com",
    REACT_APP_AUTH0_CLIENT_ID: "YlqUnmoHJ1EpT8zgrt7aKPVYJ2fbRZGp",
  },
  reactStrictMode: true,
  webpack: (config, options) => {
    config.experiments = {
      topLevelAwait: true,
      layers: true,
    };
    return config;
  },
};

export default nextConfig;
