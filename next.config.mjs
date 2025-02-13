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
  
    output: 'standalone',
  
    reactStrictMode: true,
  
    experimental: {
      serverActions: true, 
      serverComponentsExternalPackages: ['convex'], 
    },
  };
  
  export default nextConfig;