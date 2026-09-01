/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  trailingSlash: false,

  // بناء Docker فقط: يُخرج خادمًا مستقلًا في .next/standalone بلا node_modules.
  // مشروط بمتغيّر بيئة حتى لا يتغيّر شيء في بناء Vercel.
  output: process.env.DOCKER_BUILD === "1" ? "standalone" : undefined,
};

export default nextConfig;
