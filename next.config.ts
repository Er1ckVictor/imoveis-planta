import type { NextConfig } from 'next';

/**
 * Exportação estática para o GitHub Pages.
 * NEXT_PUBLIC_BASE_PATH é definido pelo workflow (.github/workflows/deploy.yml):
 *   "/nome-do-repositorio" para https://usuario.github.io/nome-do-repositorio
 *   vazio para domínio próprio ou repositório usuario.github.io
 */
const basePath = (process.env.NEXT_PUBLIC_BASE_PATH ?? '').replace(/\/$/, '');

const nextConfig: NextConfig = {
  output: 'export',
  basePath: basePath || undefined,
  trailingSlash: true,
  images: { unoptimized: true },
  reactStrictMode: true,
  poweredByHeader: false,
};

export default nextConfig;
