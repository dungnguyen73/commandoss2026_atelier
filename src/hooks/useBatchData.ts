import { useCurrentClient } from "@mysten/dapp-kit-react";
import { useQuery } from "@tanstack/react-query";

interface OriginItem {
  id: string;
  name: string;
  category: string;
  quantity: string;
  farm: string;
  province: string;
  certification: string;
  history: Array<{
    event_type: string;
    timestamp: string;
    location: string;
    note: string;
    actor: string;
  }>;
  creator: string;
  created_at: string;
}

interface UseBatchDataReturn {
  batch: OriginItem | null;
  ownerAddress: string | null;
  isLoading: boolean;
  error: unknown | null;
  refetch: () => void;
}

export function useBatchData(objectId?: string): UseBatchDataReturn {
  const client = useCurrentClient();

  const queryResult = useQuery({
    queryKey: ["getObject", objectId],
    queryFn: async () => {
      if (!objectId) throw new Error("objectId required");

      try {
        // gRPC Ledger service (primary - new SDK)
        return await (client as any).ledger?.getObject({
          objectId,
        });
      } catch {
        // Fallback: JSON-RPC getObject
        return await fetch('https://fullnode.testnet.sui.io:443', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            jsonrpc: '2.0',
            id: 1,
            method: 'sui_getObject',
            params: [
              objectId,
              { showContent: true, showDisplay: true, showOwner: true }
            ]
          })
        }).then(r => r.json());
      }
    },
    enabled: !!objectId,
    staleTime: 30_000,
  });

  let parsedData: OriginItem | null = null;
  let ownerAddress: string | null = null;

  if (queryResult.data) {
    try {
      // Unified parsing for gRPC/JSON-RPC
      const response = queryResult.data;
      const object = 'object' in response ? response.object?.data : response.result?.data;

      if (!object) return { batch: null, ownerAddress: null, ...queryResult };

      const content = object.content?.fields || object.json || object.content;

      parsedData = {
        id: object.objectId || '',
        name: object.display?.data?.name || content?.name || 'Unknown',
        category: content?.category || 'Unknown',
        quantity: content?.quantity || '0',
        farm: content?.farm || 'Unknown',
        province: content?.province || 'Unknown',
        certification: content?.certification || 'None',
        history: content?.history || [],
        creator: content?.creator || '',
        created_at: content?.created_at || '0',
      };

      // Owner extraction (gRPC/JSON-RPC compatible)
      const owner = object.owner;
      if (typeof owner === 'string') {
        ownerAddress = owner;
      } else if (owner?.AddressOwner) {
        ownerAddress = owner.AddressOwner;
      }
    } catch (e) {
      console.error("Failed to parse batch data:", e);
    }
  }

  return {
    batch: parsedData,
    ownerAddress,
    isLoading: queryResult.isLoading,
    error: queryResult.error,
    refetch: queryResult.refetch,
  };
}