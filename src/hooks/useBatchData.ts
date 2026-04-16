import { useCurrentClient } from "@mysten/dapp-kit-react";
import { useQuery } from "@tanstack/react-query";

export function useBatchData(objectId: string | undefined) {
  const client = useCurrentClient();

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["getObject", objectId],
    queryFn: () =>
      client.getObject({
        objectId: objectId!,
        include: {
          json: true,
          content: true,
        },
      }),
    enabled: !!objectId,
  });

  let parsedData: any = null;
  if (data?.object) {
    try {
      parsedData = data.object.json;
    } catch (e) {
      console.error("Failed to parse batch data:", e);
    }
  }

  return {
    batch: parsedData,
    isLoading,
    error,
    refetch,
  };
}
