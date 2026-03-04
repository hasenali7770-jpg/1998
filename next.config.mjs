/** @type {import('next').NextConfig} */
const nextConfig = {
  // هذا السطر هو مفتاح الحل؛ سيجعل الروابط تعمل ببساطة كـ string
  experimental: {
    typedRoutes: false,
  },
};

export default nextConfig;
