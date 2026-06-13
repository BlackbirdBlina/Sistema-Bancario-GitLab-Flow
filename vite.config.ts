import { defineConfig } from "vitest/config";

export default defineConfig({
  resolve: {
    tsconfigPaths: true, // <-- ADICIONE ESSA LINHA AQUI (Ativa o suporte nativo)
  },
  test: {
    globals: true,
    environment: "node", // ou 'node', dependendo do seu projeto
  },
});
