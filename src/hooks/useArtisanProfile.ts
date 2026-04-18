import { useQuery } from "@tanstack/react-query";
import { ATELIER_PACKAGE_ID } from "../config/network";

export function useArtisanProfile(address?: string) {
  const query = useQuery({
    queryKey: ["artisan-profile", address],
    queryFn: async () => {
      if (!address) return null;

      const response = await fetch("https://fullnode.testnet.sui.io:443", {
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
                StructType: `${ATELIER_PACKAGE_ID}::atelier::ArtisanProfile`,
              },
              options: {
                showContent: true,
                showOwner: true,
              },
            },
            null,
            1,
          ],
        }),
      });

      const body = await response.json();
      if (body?.error) {
        throw new Error(body.error.message || "Failed to fetch artisan profile");
      }

      const data = body.result.data || [];
      if (data.length === 0) return null;

      const profileObj = data[0].data;
      const fields = profileObj.content?.fields || profileObj.content || {};
      const roots = fields.roots || [];
      
      console.log(`[useArtisanProfile] Found profile ${profileObj.objectId} with ${roots.length} items`);

      return {
        id: profileObj.objectId,
        roots,
      };

    },
    enabled: !!address,
  });

  return {
    profile: query.data,
    isLoading: query.isLoading,
    error: query.error,
    refetch: query.refetch,
  };
}
