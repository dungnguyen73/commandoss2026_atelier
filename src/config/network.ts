// Fallback to the known testnet package ID if the environment variable is not set
export const ATELIER_PACKAGE_ID =
  import.meta.env.VITE_ATELIER_PACKAGE_ID ||
  "0xb1b63cf15e0fe6c5fde1e9f6a39d33ec9e5261005a745520cf1b0429cef0f738";

