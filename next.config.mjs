/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Static front-end demo: exports to /out as plain HTML/CSS/JS for Netlify Drop.
  // (Backend routes are parked in /parked-backend for the tech team.)
  output: "export",
  images: { unoptimized: true },
  eslint: { ignoreDuringBuilds: true },
};

export default nextConfig;
