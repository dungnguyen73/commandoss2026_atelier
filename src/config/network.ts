// Fallback to the known testnet package ID if the environment variable is not set
export const ATELIER_PACKAGE_ID =
  import.meta.env.VITE_ATELIER_PACKAGE_ID ||
  "0x3fbeaad9f99986663cdd4147dfe85d0c9d268c450477f9104d3159fe2c34da77";
