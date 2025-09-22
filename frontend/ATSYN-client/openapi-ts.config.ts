import { defineConfig } from "@hey-api/openapi-ts";

process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

const BACKEND_URL = "http://localhost:50549";

const outputDir = "src/api";

export default defineConfig({
  input: `${BACKEND_URL}/swagger/v1/swagger.json`,
  output: {
    path: outputDir,
    format: "prettier",
  },
  plugins: [
    "@hey-api/client-fetch",
    {
      asClass: true,
      name: "@hey-api/sdk",
    },
    "zod",
    {
      enums: "javascript",
      name: "@hey-api/typescript",
    },
  ],
  logs: {
    file: false,
    level: "trace",
  },
});

process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
