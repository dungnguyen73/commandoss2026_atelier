import { useCurrentClient } from "@mysten/dapp-kit-react";
import { useQuery } from "@tanstack/react-query";
import { ArtisanCertificate } from "../contracts/atelier/atelier";

export function useCertificateData(objectId?: string) {
  const client = useCurrentClient();

  const query = useQuery({
    queryKey: ["certificate-data", objectId],
    queryFn: async () => {
      if (!objectId) return null;
      
      // The generated MoveStruct wrapper handles fetching and strictly 
      // typing the JSON result automatically using the SDK.
      const result = await ArtisanCertificate.get({ 
        client: client as any, 
        objectId, 
        showOwner: true 
      } as any);
      
      return result;
    },
    enabled: !!objectId,
    staleTime: 60_000,
  });

  let ownerAddress: string | undefined;
  if (query.data?.owner) {
    const owner = query.data.owner;
    ownerAddress = 
      (owner as any).AddressOwner || 
      (owner as any).ObjectOwner || 
      undefined;
  }

  return {
    // The decoded JSON is fully typed matching the ArtisanCertificate shape
    certificate: query.data?.json ?? null,
    ownerAddress,
    isLoading: query.isLoading,
    error: query.error,
    refetch: query.refetch,
  };
}
