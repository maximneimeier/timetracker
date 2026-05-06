import type { NextConfig } from "next";

/** Statischer Export für nginx (Output: ./out). Kein distDir:'dist' — sonst schreibt Turbopack
 *  unter dist/dev/ und kann mit Export/Build kollidieren → sporadische 500 / ENOENT im Dev. */
const nextConfig: NextConfig = {
  output: "export",
};

export default nextConfig;
