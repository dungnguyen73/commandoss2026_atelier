const address = "0x1acd0b4ebe4b18e5b6be3b7789c3ba137ea2393bab825da71fb25b9e5f6803de";

async function fetchAllOwnedObjects() {
  console.log("Querying SUI Testnet directly via JSON-RPC...");
  let allObjects: any[] = [];
  let hasNextPage = true;
  let cursor = null;

  while (hasNextPage) {
    const response = await fetch("https://fullnode.testnet.sui.io:443", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        jsonrpc: "2.0",
        id: 1,
        method: "suix_getOwnedObjects",
        params: [
          address,
          { filter: { StructType: "0x147d9fa6a152df85ec449aadad46ac51d240013f94907ef979cdaf71f9115323::chain_passport::OriginItem" }, options: { showType: true, showContent: true } },
          cursor,
          50,
        ],
      }),
    });

    const body = await response.json();
    if (body.error) {
      console.error("RPC Error:", body.error);
      break;
    }

    const { data, nextCursor, hasNextPage: hasNext } = body.result;
    allObjects = allObjects.concat(data);
    cursor = nextCursor;
    hasNextPage = hasNext;
  }

  console.log(`Successfully fetched ${allObjects.length} OriginItem batches from Testnet.`);
  
  const batches = allObjects.map((obj: any) => {
    const parsedData = obj.data?.content?.fields;
    return {
      id: obj.data?.objectId,
      name: parsedData?.name,
      category: parsedData?.category,
    };
  });

  console.log("================ BATCHES FOUND ================");
  console.log(batches);
}

fetchAllOwnedObjects();
