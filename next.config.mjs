/** @type {import('next').NextConfig} */
const nextConfig = {
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

module.exports = nextConfig;
