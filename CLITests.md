# Browser & CLI Integration Tests

Here is a suite of terminal scripts using the native `sui client call` commands to test your Smart Contract directly. Executing these rules via CLI bypasses your frontend entirely. 
After running them in your terminal, simply jump into your browser and watch how your React app interprets the raw blockchain modifications dynamically.

> **Pre-requisite:**
> In your terminal, ensure you are on the correct active network. Check with `sui client active-env` (should be `testnet`).
> *Note: Replace `[PACKAGE_ID]` below with your Testnet Package ID: `0x3fbeaad9f99986663cdd4147dfe85d0c9d268c450477f9104d3159fe2c34da77`*

---

## Test Case 1: Mint an explicitly Tampered item via CLI

We intentionally pass an invalid hash (`"bad_hash_123"`) to see if the frontend's zero-trust `hash.ts` algorithm intercepts it correctly.

**Run in Terminal:**
```bash
sui client call `
  --package 0x3fbeaad9f99986663cdd4147dfe85d0c9d268c450477f9104d3159fe2c34da77 `
  --module atelier `
  --function create_certificate `
  --args "CLI Vase" "Ceramics" "Jane Doe" "London" "Clay" "Minted without frontend" "bad_hash_123" 0x6 `
  --gas-budget 50000000
```

**Expected Browser Results:**
1. Reload your `/dashboard` logged in as the same wallet used by the CLI.
2. An item titled `"CLI Vase"` should exist under the **Artisan** tab (because your address matches the creator field).
3. Click it to open the details page (`/item/:id`).
4. **Zero-Trust Check:** The badge on the right should emphatically blink **"Tampered"** in red, because the SUI string `"bad_hash_123"` does not legitimately map to SHA256("CLI Vase|Ceramics|Jane Doe|London|Clay|Minted without frontend").

---

## Test Case 2: Append a Provenance Timeline Event

Take the Object ID generated in Test 1. We will fake a gallery exhibition event natively via the blockchain. 

**Run in Terminal:**
```bash
# Replace <OBJECT_ID> with the actual ID from Test 1
sui client call `
  --package 0x3fbeaad9f99986663cdd4147dfe85d0c9d268c450477f9104d3159fe2c34da77 `
  --module atelier `
  --function add_provenance_event `
  --args <OBJECT_ID> "Exhibited" "London Gallery" "Featured in the main hall." 0x6 `
  --gas-budget 50000000
```

**Expected Browser Results:**
1. Refresh the `/item/<OBJECT_ID>` detail page on the app.
2. Scroll to the **Provenance Timeline**.
3. A brand new node should immediately appear labeled **"Exhibited"** taking place in *"London Gallery"* with your exact note applied.

---

## Test Case 3: Test Cross-Role Permissions by Transferring the Certificate

Let's test the new routing logic in `DashboardPage.tsx`! Transfer the object to a separate SUI wallet you own (or a friend's active address). 

**Run in Terminal:**
```bash
# Replace <OBJECT_ID> and <RECIPIENT_ADDRESS> 
sui client call `
  --package 0x3fbeaad9f99986663cdd4147dfe85d0c9d268c450477f9104d3159fe2c34da77 `
  --module atelier `
  --function transfer_certificate `
  --args <OBJECT_ID> <RECIPIENT_ADDRESS> `
  --gas-budget 50000000
```

**Expected Browser Results:**
1. Look at your dashboard. The item is entirely **gone** from the Artisan tab.
2. Disconnect your wallet, and reconnect using the `<RECIPIENT_ADDRESS>` wallet.
3. Because the recipient address did not *create* the item, it does NOT appear in their Artisan tab. 
4. Click the **Owner** tab—the `"CLI Vase"` should perfectly populate there, ready to be safely held, and the "Transfer Certificate" permissions should now be granted exclusively to them!
