import { useCurrentClient } from "@mysten/dapp-kit-react";
import { useQuery } from "@tanstack/react-query";
import { ArtisanCertificate } from "../contracts/atelier/atelier";

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

interface UseBatchDataReturn {
  batch: OriginItemFields | null;
  isLoading: boolean;
  error: unknown;
  ownerAddress?: string;
  refetch: () => void;
}

/* ================= HOOK ================= */

export function useBatchData(objectId?: string): UseBatchDataReturn {
  const client = useCurrentClient();

  const query = useQuery({
    queryKey: ["certificate-data", objectId],
    queryFn: async () => {
      if (!objectId) return null;
      
      const result = await ArtisanCertificate.get({
        client: client as any,
        objectId,
        showOwner: true,
      } as any);

      return result;
    },
    enabled: !!objectId,
    staleTime: 60_000,
  });

  let parsedData: OriginItemFields | null = null;
  let ownerAddress: string | undefined;

  const res = query.data;

  if (res?.json) {
    // The decoded JSON is fully typed matching the ArtisanCertificate shape
    parsedData = res.json as unknown as OriginItemFields;
  }

  // Extract owner
  if (res?.owner) {
    const owner = res.owner as any;
    ownerAddress =
      owner.AddressOwner ||
      owner.ObjectOwner ||
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
