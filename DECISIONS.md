# Key Decisions & Rules

## Canonical Certificate Fields
A strict serialization standard is enacted to ensure the SUI environment and Frontend environment agree definitively on what constitutes an authentic hash string.
The ordered list is:
1. `name`
2. `category`
3. `artisanName`
4. `location`
5. `materials`
6. `note` (Defaults to `"N/A"` if absent)

## Hashing Rules
- **Encoding Algorithm:** Uses the browser's native `crypto.subtle.digest("SHA-256", ...)`.
- **Delimiter:** To prevent payload or concatenation injections, properties are trimmed and forcibly joined with the pipe (`|`) delimiter.
- **Verification Rule:** `isTampered` strictly assumes a TRUE value if the fetched JSON fields re-hashed locally do not generate an identical 64-character HEX string compared to the on-chain `.cert_hash`.

## Ownership Rules
- Certificate items (`ArtisanCertificate`) possess native `key, store` capabilities. They are standard SUI objects belonging to a specific owner address.
- Read actions (Scanning, verifying hashes) require ZERO permissions.
- Write actions (Appending timeline events, initiating wallet transfers) execute via `sui::tx_context` gating confirming the caller identity matches the active holder.

## Known Limitations
- The underlying `sui_getOwnedObjects` RPC fetching operates safely via native `fetch` over manual SDK typing wrappers to bypass a known nested class structure mismatch in the underlying dapp-kit type definition layers (`ClientWithCoreApi`).
- Cryptographic verification verifies that the data string *read* from typical RPC fields matches the intentional hash input originally provided. It detects physical DB corruption or RPC MITM spoofing, but the UI itself must be hosted over TLS natively (Vercel) to protect against runtime javascript injection. 
