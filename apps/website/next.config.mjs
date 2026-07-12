/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  images: { unoptimized: true },
  // The docs site is fully static; trailing slashes keep exported paths clean.
  trailingSlash: true,
};

export default nextConfig;
