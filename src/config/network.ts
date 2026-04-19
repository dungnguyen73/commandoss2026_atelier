// Fallback to the known testnet package ID if the environment variable is not set
export const ATELIER_PACKAGE_ID =
  import.meta.env.VITE_ATELIER_PACKAGE_ID ||
  "0x8e8f602018b060e81101224c04e29008cb617d405aff22e65f08ba992d151e99";

export const VERIFICATION_REGISTRY_ID =
  import.meta.env.VITE_VERIFICATION_REGISTRY_ID ||
  "0xcf807271e450140b683cb6c21a2956fff489380b8bd79dbbd81b26936c18501b";

export const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID || "";
export const ZK_PROVER_URL = import.meta.env.VITE_ZK_PROVER_URL || "https://prover-dev.mystenlabs.com/v1";
export const ZK_REDIRECT_URI = import.meta.env.VITE_ZK_REDIRECT_URI || "http://localhost:5173/auth/callback";

