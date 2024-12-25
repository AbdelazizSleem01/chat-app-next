/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true, 
    experimental: {
      appDir: true, 
    },
    async redirects() {
      return [
        {
          source: '/',
          destination: '/conversations',
          permanent: true,
        },
      ];
    },
  };
  
  export default nextConfig;
  