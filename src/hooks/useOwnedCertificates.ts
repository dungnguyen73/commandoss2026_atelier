import { useQuery } from "@tanstack/react-query";
import { ATELIER_PACKAGE_ID } from "../config/network";

export function useOwnedCertificates(address?: string) {
  const query = useQuery({
    queryKey: ["owned-certificates", address],
    queryFn: async () => {
      if (!address) return [];

      let allObjects: any[] = [];
      let hasNextPage = true;
      let cursor: string | null = null;

      while (hasNextPage) {
        const response: Response = await fetch("https://fullnode.testnet.sui.io:443", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
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
                  showContent: true,
                },
              },
              cursor,
              50,
            ],
          }),
        });

        const body = await response.json();
        if (body?.error) {
          throw new Error(body.error.message || "RPC Error");
        }

        const data = body.result.data || [];
        allObjects.push(...data);
        
        cursor = body.result.nextCursor;
        hasNextPage = body.result.hasNextPage;
      }

      // Map the SUI JSON response directly (RPC performs the BCS decoding for us when showContent is true)
      return allObjects.map(obj => {
        const parsed = obj.data.content.fields;
        const { id, created_at, ...rest } = parsed;
        return {
          id: obj.data.objectId,
          createdAt: new Date(Number(created_at)).toLocaleDateString(),
          created_at,
          ...rest
        };
      });
    },
    enabled: !!address,
    staleTime: 60_000,
  });

  return {
    certificates: query.data ?? [],
    isLoading: query.isLoading,
    error: query.error,
    refetch: query.refetch,
  };
}
