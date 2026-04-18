# Project State

This outlines the current progression of Phase completion against the core `project_spec.md`.

## ✅ Completed (Phases 1-4)
- **Environment Integration:** Connect to the SUI Testnet or arbitrary networks seamlessly via `.env` definitions (`VITE_ATELIER_PACKAGE_ID`).
- **Data Bindings:** Pure typescript auto-generated wrappers interacting safely without legacy manual cast assumptions.
- **Creation Flow:** Artisans can successfully connect wallets and mint certificates on-chain dynamically generating a `cert_hash` through the `computeCertificateHash()` utility.
- **Public Verification Flow:** `ItemDetailPage` correctly resolves certificate objects, decodes `bcs` payloads, displays lineage events, and autonomously performs cryptographic data matching to throw "Tampered" warnings natively on validation failure.
- **Transfer Capabilities:** Permanent SUI object ownership transfers successfully record and execute.

## ⏳ Pending / Out of Scope (Next Steps)
- **Image Hashes (IPFS):** Currently, certificates are strictly string-based. Images and their IPFS references were deliberately deferred out of Phase 3 execution and must be integrated.
- **Artisan Profiles:** A broader gallery page displaying multiple pieces from a unified string publisher or verified ID.
- **Demo Readiness Check:** Final polish sweeps to remove generic placeholders and optimize loading indicators across low-bandwidth environments.
