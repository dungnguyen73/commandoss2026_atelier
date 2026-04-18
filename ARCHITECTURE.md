# Architecture

The Atelier utilizes a localized static web application interface communicating directly with the SUI Blockchain.

## Frontend Stack
- **Framework:** React 19 + TypeScript bundled with Vite.
- **Styling:** Tailwind CSS with minimal `shadcn/ui` components (buttons, badges).
- **Wallet & Context:** `@mysten/dapp-kit-react` interacting natively with installed SUI extensions.
- **Data Fetching:** Standard JSON-RPC (`fetch`) and `@tanstack/react-query` using the generated `sui-ts-codegen` bindings for strictly-typed decoding.
- **Key Files:** 
  - `src/lib/hash.ts`: Native `WebCrypto` hashing algorithms.
  - `src/hooks/useCertificateData.ts` & `src/hooks/useOwnedCertificates.ts`: Core data fetching bridges.

## SUI Smart Contract (Move)
- **Path:** `move/atelier/sources/atelier.move`
- **Objects:**
  - `ArtisanCertificate`: The primary generic asset, carrying metadata, history vectors, and lifecycle strings. `key, store` capability ensures native SUI transfers.
  - `ProvenanceEvent`: An appended struct payload detailing life events (sold, exhibited, etc.) associated with the certificate.
- **Security:** Standard UID ownership prevents non-holders from executing mutations or appending events. Updates are strictly governed by current-owner conditions.
