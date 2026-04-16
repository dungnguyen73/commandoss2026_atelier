import { createDAppKit } from "@mysten/dapp-kit-react";
import { SuiGrpcClient } from "@mysten/sui/grpc";

// TODO (Phase 2): Replace with deployed ChainPassport package IDs after `sui move publish`
const DEVNET_COUNTER_PACKAGE_ID = "";
const TESTNET_CHAIN_PASSPORT_PACKAGE_ID = "0x147d9fa6a152df85ec449aadad46ac51d240013f94907ef979cdaf71f9115323";
const TESTNET_COUNTER_PACKAGE_ID = "";
const MAINNET_COUNTER_PACKAGE_ID = "";

const GRPC_URLS = {
  mainnet: "https://fullnode.mainnet.sui.io:443",
  testnet: "https://fullnode.testnet.sui.io:443",
  devnet: "https://fullnode.devnet.sui.io:443",
};

// MVR overrides per network - map local package names to deployed addresses
const MVR_OVERRIDES = {
  mainnet: MAINNET_COUNTER_PACKAGE_ID && {
    packages: {
      "@local-pkg/counter": MAINNET_COUNTER_PACKAGE_ID,
    },
  },
  testnet: {
    packages: {
      "@local-pkg/counter": TESTNET_COUNTER_PACKAGE_ID,
      "@local-pkg/chain-passport": TESTNET_CHAIN_PASSPORT_PACKAGE_ID,
    },
  },
  devnet: DEVNET_COUNTER_PACKAGE_ID && {
    packages: { "@local-pkg/counter": DEVNET_COUNTER_PACKAGE_ID },
  },
} as const;

export const dAppKit = createDAppKit({
  enableBurnerWallet: import.meta.env.DEV,
  networks: ["mainnet", "testnet", "devnet"],
  defaultNetwork: "testnet",
  createClient(network) {
    return new SuiGrpcClient({
      network,
      baseUrl: GRPC_URLS[network],
      mvr: MVR_OVERRIDES[network] ? { overrides: MVR_OVERRIDES[network] } : {},
    });
  },
});

// global type registration necessary for the hooks to work correctly
declare module "@mysten/dapp-kit-react" {
  interface Register {
    dAppKit: typeof dAppKit;
  }
}
