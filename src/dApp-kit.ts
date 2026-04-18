import { createDAppKit } from '@mysten/dapp-kit-core';
import { SuiGrpcClient } from '@mysten/sui/grpc';

const GRPC_URLS = {
  testnet: 'https://fullnode.testnet.sui.io:443',
  devnet: 'https://fullnode.devnet.sui.io:443',
  mainnet: 'https://fullnode.mainnet.sui.io:443',
};

export const dAppKit = createDAppKit({
  networks: ['testnet', 'devnet', 'mainnet'],
  createClient: (network) => new SuiGrpcClient({ network, baseUrl: GRPC_URLS[network] }),
});