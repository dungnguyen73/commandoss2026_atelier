import { getFullnodeUrl, SuiClient } from '@mysten/sui/client';

(async () => {
    const client = new SuiClient({ url: getFullnodeUrl('testnet') });
    
    // User's address can be extracted or I'll just check what the wallet is holding but I don't know the exact address.
    // I will list an object's structure instead. 
    // Or I can listOwnedObjects for the address that user has logged into. Let's see if we can get active address.
    const res = await client.listOwnedObjects({ owner: process.argv[2] || "0x0", options: { showType: true, showContent: true } })
    console.log(JSON.stringify(res.data.slice(0,2), null, 2));
})();
