import type { SuiCodegenConfig } from "@mysten/codegen";

const config: SuiCodegenConfig = {
  output: "./src/contracts",
  packages: [
    {
      package: "@local-pkg/counter",
      path: "./move/counter",
    },
    {
      package: "@local-pkg/atelier",
      path: "./move/atelier",
    },
  ],
};

export default config;
