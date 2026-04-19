import { useQuery } from "@tanstack/react-query";
import { Transaction } from "@mysten/sui/transactions";
import { ATELIER_PACKAGE_ID, VERIFICATION_REGISTRY_ID } from "../config/network";
import { bcs } from "@mysten/sui/bcs";
import { toBase64, fromBase64 } from "@mysten/sui/utils";
import { useCurrentClient } from "@mysten/dapp-kit-react";

const RPC_URL = "https://fullnode.mainnet.sui.io:443";
const ZERO_ADDRESS = "0x0000000000000000000000000000000000000000000000000000000000000000";

/**
 * Parses a u64 from a devInspect returnValue entry.
 * The Sui RPC may return the bytes as either:
 *   - number[]  (e.g. [5, 0, 0, 0, 0, 0, 0, 0]) — older node format
 *   - base64 string (e.g. "BQAAAAAAAAA=")          — newer node format
 */
function parseU64ReturnValue(raw: number[] | string | undefined | null): number {
  if (!raw) return 0;
  let bytes: Uint8Array;
  if (typeof raw === "string") {
    // Newer Sui RPC nodes return base64-encoded bytes
    bytes = fromBase64(raw);
  } else {
    // Older format: plain array of byte values
    bytes = new Uint8Array(raw);
  }
  return Number(bcs.u64().parse(bytes));
}

export function useVotingData(certId?: string) {
  const client = useCurrentClient();

  return useQuery({
    queryKey: ["voting-data", certId],
    queryFn: async () => {
      if (!certId || !VERIFICATION_REGISTRY_ID) {
        return { upvotes: 0, downvotes: 0 };
      }

      try {
        const tx = new Transaction();

        // Bug fix 1: use tx.pure.id() for 0x2::object::ID, NOT tx.pure.address().
        // Even though both have the same BCS bytes (32-byte address), the type tag
        // embedded in the PTB differs. Passing `address` for an `ID` parameter
        // causes the Sui node's deserializer to reject the transaction block.
        tx.moveCall({
          target: `${ATELIER_PACKAGE_ID}::atelier::upvotes`,
          arguments: [
            tx.object(VERIFICATION_REGISTRY_ID),
            tx.pure.id(certId),
          ],
        });

        tx.moveCall({
          target: `${ATELIER_PACKAGE_ID}::atelier::downvotes`,
          arguments: [
            tx.object(VERIFICATION_REGISTRY_ID),
            tx.pure.id(certId),
          ],
        });

        tx.setSender(ZERO_ADDRESS);

        const txBytes = await tx.build({ client });

        // Bug fix 2: use toBase64() from @mysten/sui/utils instead of
        // btoa(String.fromCharCode(...txBytes)). The spread approach is fragile
        // on large byte arrays and may produce incorrect output.
        const txBytesBase64 = toBase64(txBytes);

        const response = await fetch(RPC_URL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            jsonrpc: "2.0",
            id: 1,
            method: "sui_devInspectTransactionBlock",
            params: [ZERO_ADDRESS, txBytesBase64, null, null],
          }),
        });

        const body = await response.json();

        if (body?.error) {
          throw new Error(body.error.message || "RPC devInspect failed");
        }

        const results = body.result?.results || [];

        // Bug fix 3: returnValues[i][0] may be a number[] OR a base64 string
        // depending on the Sui node version. parseU64ReturnValue handles both.
        const upRaw = results?.[0]?.returnValues?.[0]?.[0];
        const downRaw = results?.[1]?.returnValues?.[0]?.[0];

        const upvotes = parseU64ReturnValue(upRaw);
        const downvotes = parseU64ReturnValue(downRaw);

        return { upvotes, downvotes };
      } catch (e) {
        console.error("Failed to fetch voting data:", e);
        return { upvotes: 0, downvotes: 0 };
      }
    },
    enabled: !!certId,
    refetchInterval: 10_000,
  });
}
