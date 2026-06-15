import { fileURLToPath } from "node:url";

const appRoot = fileURLToPath(new URL(".", import.meta.url));

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "export",
  outputFileTracingRoot: appRoot,
  turbopack: {
    root: appRoot
  },
  trailingSlash: true,
  devIndicators: false
};

export default nextConfig;
