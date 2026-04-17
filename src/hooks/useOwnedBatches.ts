import { useCurrentClient } from "@mysten/dapp-kit-react";
import { useQuery } from "@tanstack/react-query";

// Standard TypeScript interfaces (no generated imports needed)
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

interface GrpcOwnedObjectsResponse {
  objects: any[];
  hasNextPage: boolean;
  nextCursor: string | null;
}

interface UseOwnedBatchesReturn {
  batches: Array<OriginItem & { status: string }>;
  isLoading: boolean;
  error: unknown | null;
  refetch: () => void;
}

export function useOwnedBatches(address?: string): UseOwnedBatchesReturn {
  const client = useCurrentClient();

  const queryResult = useQuery({
    queryKey: ["getOriginItems", address],
    queryFn: async (): Promise<any[]> => {
      if (!address) return [];

      const allObjects: any[] = [];
      let cursor: string | undefined = undefined;
      let hasNextPage = true;

      while (hasNextPage) {
        const response: GrpcOwnedObjectsResponse = await (client as any).listOwnedObjects({
          owner: address,
          cursor,
          options: {
            showType: true,
            showContent: true,
            showDisplay: true,
          },
          // filter: {
          //   MatchAny: [{ StructType: "chain_passport::OriginItem" }]
          // }
        });

        if (response.objects?.length) {
          allObjects.push(...response.objects);
        }
        hasNextPage = response.hasNextPage;
        cursor = response.nextCursor ?? undefined;
      }

      console.log("DEBUG gRPC OriginItems:", allObjects.length);
      return allObjects;
    },
    enabled: !!address,
    staleTime: 60_000,
  });

  console.log("DEBUG queryResult:", queryResult);

  const batches: Array<OriginItem & { status: string }> = queryResult.data?.map((obj: any) => {
    const content = obj.data?.content?.fields || obj.data?.json || {};

    return {
      id: obj.data?.objectId || '',
      name: content.name || obj.data?.display?.data?.name || 'Unknown',
      category: content.category || 'Unknown',
      quantity: content.quantity || '0',
      farm: content.farm || 'Unknown',
      province: content.province || 'Unknown',
      certification: content.certification || 'None',
      history: content.history || [],
      creator: content.creator || '',
      created_at: content.created_at || '0',
      status: 'Verified' as const,
    };
  }) || [];

  return {
    batches,
    isLoading: queryResult.isLoading,
    error: queryResult.error,
    refetch: queryResult.refetch,
  };
}