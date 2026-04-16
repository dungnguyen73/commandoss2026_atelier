import type { SuiCodegenConfig } from "@mysten/codegen";

const config: SuiCodegenConfig = {
  output: "./src/contracts",
  packages: [
    {
      package: "@local-pkg/counter",
      path: "./move/counter",
    },
    {
      package: "@local-pkg/chain-passport",
      path: "./move/chain_passport",
    },
  ],
};

export default config;
