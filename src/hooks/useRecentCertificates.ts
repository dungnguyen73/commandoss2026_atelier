import { useQuery } from "@tanstack/react-query";
import { useStore } from "@nanostores/react";
import { $recentIds } from "../store/recentStore";

export function useRecentCertificates() {
  const ids = useStore($recentIds);

  const query = useQuery({
    queryKey: ["recent-certificates", ids],
    queryFn: async () => {
      if (ids.length === 0) return [];

      const response = await fetch("https://fullnode.testnet.sui.io:443", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          jsonrpc: "2.0",
          id: 1,
          method: "sui_multiGetObjects",
          params: [
            ids,
            {
              showContent: true,
              showOwner: true,
            },
          ],
        }),
      });

      const body = await response.json();
      if (body?.error) {
        throw new Error(body.error.message || "Failed to fetch recent objects");
      }

      const objects = body.result || [];

      return objects
        .filter((obj: any) => obj.data && obj.data.content)
        .map((obj: any) => {
          const content = obj.data.content.fields;
          const { id: _, created_at, ...rest } = content;
          return {
            id: obj.data.objectId,
            createdAt: new Date(Number(created_at)).toLocaleDateString(),
            created_at,
            currentOwner: obj.data.owner,
            ...rest
          };
        });
    },
    enabled: ids.length > 0,
    staleTime: 30_000,
  });

  return {
    certificates: query.data ?? [],
    isLoading: query.isLoading,
    error: query.error,
  };
}
