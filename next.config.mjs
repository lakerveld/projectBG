/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  outputFileTracingIncludes: {
    "/api/journey": ["./content/locatiequizzen.md"],
    "/api/journey/admin": ["./content/locatiequizzen.md"]
  }
};

export default nextConfig;
