import { SuiGrpcClient } from '@mysten/sui/grpc';

(async () => {
    const client = new SuiGrpcClient({ network: "testnet" });
    const id = "0x4b06082532c14d41c84d4224b27c9b0f26d3ebb2dcbf934dfb2cb58702c1d8af";
    
    console.log("Fetching raw object from Testnet...");
    const res = await (client as any).getObject({
        id,
        options: {
            showType: true,
            showContent: true,
            showDisplay: true,
            showOwner: true,
        }
    });
    
    console.log(JSON.stringify(res, null, 2));
})();
