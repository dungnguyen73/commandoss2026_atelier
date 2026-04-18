import { useQuery } from "@tanstack/react-query";
import { ATELIER_PACKAGE_ID } from "../config/network";
import { useStore } from "@nanostores/react";
import { $recentIds } from "../store/recentStore";

/**
 * Hook to fetch all certificates created by a specific address.
 * Unlike useOwnedCertificates, this queries on-chain events to track
 * everything the artisan has ever minted, even if it has been transferred.
 */
export function useCreatedCertificates(address?: string) {
  const recentIds = useStore($recentIds);

  const query = useQuery({
    queryKey: ["created-certificates", address, recentIds],
    queryFn: async () => {
      if (!address) return [];

      // 1. Query for CertificateCreated events where the address was the sender
      const eventsResponse = await fetch("https://fullnode.testnet.sui.io:443", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          jsonrpc: "2.0",
          id: 1,
          method: "suix_queryEvents",
          params: [
            {
              And: [
                { Sender: address },
                { MoveEventType: `${ATELIER_PACKAGE_ID}::atelier::CertificateCreated` }
              ]
            },
            null, // cursor
            50,   // limit
            true, // descending order
          ],
        }),
      });
      const eventsBody = await eventsResponse.json();
      if (eventsBody?.error) {
        // throw new Error(eventsBody.error.message || "Failed to query creation events");
        return [];
      }

      const events = eventsBody.result?.data || [];

      // Extract unique certificate IDs from the events
      const eventIds = events
        .map((ev: any) => ev.parsedJson?.cert_id)
        .filter(Boolean);

      // Merge with recent IDs from local store to handle indexer lag
      const certIds = [...new Set([...eventIds, ...recentIds])];

      if (certIds.length === 0) return [];

      // 2. Fetch the current objects for these IDs
      // This ensures we show the latest status and history, regardless of current owner
      const objectsResponse = await fetch("https://fullnode.testnet.sui.io:443", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          jsonrpc: "2.0",
          id: 1,
          method: "sui_multiGetObjects",
          params: [
            certIds,
            {
              showContent: true,
              showOwner: true,
            },
          ],
        }),
      });


      const objectsBody = await objectsResponse.json();
      if (objectsBody?.error) {
        throw new Error(objectsBody.error.message || "Failed to fetch created objects");
      }

      const objects = objectsBody.result || [];

      // Map to our canonical certificate format and filter by creator
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
        })
        .filter((cert: any) => cert.creator === address);

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
