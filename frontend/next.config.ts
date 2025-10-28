import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Configuração para Docker - standalone mode
  output: 'standalone',
  
  // Otimizações para produção
  poweredByHeader: false,
  reactStrictMode: true,
  
  // Configuração de imagens (se necessário)
  images: {
    domains: ['localhost'],
  },
  
  // Variáveis de ambiente públicas
  env: {
    CUSTOM_KEY: process.env.CUSTOM_KEY,
  },
};

export default nextConfig;
