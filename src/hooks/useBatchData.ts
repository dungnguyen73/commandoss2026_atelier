import { useQuery } from "@tanstack/react-query";

/* ================= TYPES ================= */

interface OriginHistory {
  event_type: string;
  timestamp: string;
  location: string;
  note: string;
  actor: string;
}

export interface OriginItemFields {
  name: string;
  category: string;
  // Artisan fields — populated by atelier contract
  artisan_name?: string;
  location?: string;
  materials?: string;
  note?: string;
  // Legacy fields — populated by chain_passport contract (fallback)
  quantity?: string;
  farm?: string;
  province?: string;
  certification?: string;
  history: OriginHistory[];
  creator: string;
  created_at: string;
  status?: string;
}

interface SuiRpcResponse<T> {
  jsonrpc: "2.0";
  id: number;
  result: T;
  error?: {
    code: number;
    message: string;
  };
}

interface GetObjectResult {
  data?: {
    objectId: string;
    owner?: {
      AddressOwner?: string;
      ObjectOwner?: string;
      Shared?: any;
    };
    content?: {
      dataType: "moveObject";
      fields: Record<string, any>;
    };
  };
}

interface UseBatchDataReturn {
  batch: OriginItemFields | null;
  isLoading: boolean;
  error: unknown;
  ownerAddress?: string;
  refetch: () => void;
}

/* ================= FETCH ================= */

async function fetchObject(objectId: string): Promise<GetObjectResult> {
  const response: Response = await fetch("https://fullnode.testnet.sui.io:443", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      jsonrpc: "2.0",
      id: 1,
      method: "sui_getObject",
      params: [
        objectId,
        {
          showContent: true,
          showType: true,
          showOwner: true,
        },
      ],
    }),
  });

  const body: SuiRpcResponse<GetObjectResult> = await response.json();

  if (body?.error) {
    throw new Error(body.error.message || "RPC Error");
  }

  return body.result;
}

/* ================= HOOK ================= */

export function useBatchData(objectId?: string): UseBatchDataReturn {
  const query = useQuery({
    queryKey: ["getObject", objectId],
    queryFn: async () => {
      if (!objectId) return null;
      return fetchObject(objectId);
    },
    enabled: !!objectId,
    staleTime: 60_000,
  });
  /* ===== Parse data ===== */

  let parsedData: OriginItemFields | null = null;
  let ownerAddress: string | undefined;

  const obj = query.data;

  if (obj?.data?.content?.dataType === "moveObject") {
    parsedData = obj.data.content.fields as OriginItemFields;
  }

  // Extract owner
  if (obj?.data?.owner) {
    ownerAddress =
      obj.data.owner.AddressOwner ||
      obj.data.owner.ObjectOwner ||
      undefined;
  }

  return {
    batch: parsedData,
    isLoading: query.isLoading,
    error: query.error,
    ownerAddress,
    refetch: query.refetch,
  };
}
