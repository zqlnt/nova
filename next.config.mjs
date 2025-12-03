/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'i.imghippo.com',
      },
    ],
  },
};

export default nextConfig;

