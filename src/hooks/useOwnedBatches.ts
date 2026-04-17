import { useQuery } from "@tanstack/react-query";
import { ATELIER_PACKAGE_ID } from "../config/network";

interface OriginHistory {
  event_type: string;
  timestamp: string;
  location: string;
  note: string;
  actor: string;
}

export interface OriginItem {
  id: string;
  name: string;
  category: string;
  artisanName: string;
  location: string;
  materials: string;
  note: string;
  history: OriginHistory[];
  creator: string;
  created_at: string;
}

interface RpcObject {
  data?: {
    objectId?: string;
    content?: {
      fields?: Record<string, any>;
    };
  };
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

interface OwnedObjectEntry {
  data?: {
    objectId: string;
    version: string;
    digest: string;
    type?: string;
    content?: {
      dataType: "moveObject";
      type: string;
      hasPublicTransfer: boolean;
      fields: Record<string, any>;
    };
  };
}

interface GetOwnedObjectsResult {
  data: OwnedObjectEntry[];
  nextCursor: string | null;
  hasNextPage: boolean;
}

async function fetchOwnedOriginItems(address: string): Promise<RpcObject[]> {
  let allObjects: RpcObject[] = [];
  let hasNextPage = true;
  let cursor: string | null = null;

  while (hasNextPage) {
    const response: Response = await fetch("https://fullnode.testnet.sui.io:443", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        jsonrpc: "2.0",
        id: 1,
        method: "suix_getOwnedObjects",
        params: [
          address,
          {
            filter: {
              StructType: `${ATELIER_PACKAGE_ID}::atelier::ArtisanCertificate`,
            },
            options: {
              showType: true,
              showContent: true,
            },
          },
          cursor,
          50,
        ],
      }),
    });


    const body: SuiRpcResponse<GetOwnedObjectsResult> = await response.json();

    if (body?.error) {
      throw new Error(body.error.message || "RPC Error");
    }

    const { data, nextCursor, hasNextPage: hasNext } = body.result;

    allObjects.push(...data);
    cursor = nextCursor;
    hasNextPage = hasNext;
  }

  return allObjects;
}

function mapToOriginItem(obj: RpcObject): OriginItem & { status: string; location: string } {
  const content = obj.data?.content?.fields ?? {};

  return {
    id: obj.data?.objectId ?? "",
    name: content.name ?? "Unknown",
    category: content.category ?? "Unknown",
    // Support both old field names (chain_passport) and new (atelier)
    artisanName: content.artisan_name ?? content.quantity ?? "Unknown",
    location: content.location ?? content.province ?? "Unknown",
    materials: content.materials ?? content.farm ?? "Unknown",
    note: content.note ?? content.certification ?? "None",
    history: content.history ?? [],
    creator: content.creator ?? "",
    created_at: content.created_at ?? "0",
    status: content.status ?? "Certified",
  };
}

export function useOwnedBatches(address?: string) {
  const query = useQuery({
    queryKey: ["origin-items", address],
    queryFn: async () => {
      if (!address) return [];
      return fetchOwnedOriginItems(address);
    },
    enabled: !!address,
    staleTime: 60_000,
  });

  return {
    batches: (query.data ?? []).map(mapToOriginItem),
    isLoading: query.isLoading,
    error: query.error,
    refetch: query.refetch,
  };
}
