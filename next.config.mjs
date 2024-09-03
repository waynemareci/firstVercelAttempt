/** @type {import('next').NextConfig} */

const nextConfig = {
  async headers() {
    return [
      {
        // matching all API routes
        source: "/graphqlServer",
        headers: [
          { key: "Access-Control-Allow-Credentials", value: "true" },
          { key: "Access-Control-Allow-Methods", value: "GET,OPTIONS,PATCH,DELETE,POST,PUT" },
          { key: "Access-Control-Allow-Headers", value: "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version" },
        ]
      }
    ]
  },
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
