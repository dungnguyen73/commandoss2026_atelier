import { useQuery } from "@tanstack/react-query";
import { useStore } from "@nanostores/react";
import { $recentIds } from "../store/recentStore";
import { useArtisanProfile } from "./useArtisanProfile";

/**
 * Hook to fetch all certificates created by a specific address.
 * Leverages the on-chain ArtisanProfile registry, events, AND local session store.
 */
export function useCreatedCertificates(address?: string) {
  const recentIds = useStore($recentIds);
  const { profile } = useArtisanProfile(address);

  const query = useQuery({
    queryKey: ["created-certificates", address, recentIds, profile?.id, profile?.roots?.length],
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
              Sender: address,
            },
            null,
            null,
            false,
          ],
        }),
      });

      const eventsBody = await eventsResponse.json();
      if (eventsBody?.error) {
        console.warn("Event query failed, falling back to registry:", eventsBody.error);
      }

      const events = eventsBody.result?.data || [];
      
      // Extract unique certificate IDs from the events
      const eventIds = events
        .map((ev: any) => ev.parsedJson?.cert_id)
        .filter(Boolean);

      // Extract IDs from the on-chain profile registry if it exists
      const profileIds = profile?.roots || [];

      // Merge with recent IDs from local store and on-chain profile to handle all discovery paths
      // We also normalize all IDs to ensure uniqueness
      const certIds = [...new Set([...profileIds, ...eventIds, ...recentIds])].filter(Boolean);
      
      console.log("[useCreatedCertificates] Discovered IDs:", {
        profileIds,
        eventIds,
        recentIds,
        merged: certIds
      });

      if (certIds.length === 0) return [];


      // 2. Fetch the current objects for these IDs
      const objectsResponse = await fetch("https://fullnode.testnet.sui.io:443", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
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

      // Map to our canonical certificate format
      // We no longer strictly filter by creator because we trust the source (Profile/Events)
      // This makes the UI more resilient to address normalization issues.
      return objects
        .filter((obj: any) => obj.data && obj.data.content)
        .map((obj: any) => {
          const content = obj.data.content.fields;
          const { id: _, created_at, ...rest } = content;
          return {
            id: obj.data.objectId,
            createdAt: created_at ? new Date(Number(created_at)).toLocaleDateString() : "Unknown",
            created_at,
            currentOwner: obj.data.owner,
            ...rest
          };
        })
        .sort((a: any, b: any) => Number(b.created_at || 0) - Number(a.created_at || 0));
    },
    enabled: !!address,
    // Keep it relatively fresh
    staleTime: 5000,
  });

  return {
    certificates: query.data ?? [],
    isLoading: query.isLoading,
    error: query.error,
    refetch: query.refetch,
  };
}
