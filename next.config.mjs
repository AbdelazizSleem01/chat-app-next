/** @type {import('next').NextConfig} */
const nextConfig = {
  // Redirects configuration
  async redirects() {
    return [
      {
        source: '/',
        destination: '/conversations',
        permanent: true,
      },
    ];
  },

  reactStrictMode: true,

  experimental: {
   
    serverActions: {}, 

    serverExternalPackages: ['convex'],
  },
};

export default nextConfig;