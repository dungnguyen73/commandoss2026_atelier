# Phase 2: Core Blockchain Logic & Minting

Implement the foundational smart contract and on-chain logic for ChainPassport, enabling batch registration and lifecycle event tracking.

## Goals
- Create the core Move contract for food traceability.
- Enable single-item minting of product batches.
- Implement a portable event history stored within the on-chain object.
- Integrate the minting transaction flow into the frontend.

## Proposed Changes

### [Move Smart Contract]
- **Structs**: Define `OriginItem` (key, store) and `OriginEvent` (store, drop, copy).
- **Functions**:
  - `create_origin_item`: Mints a batch and records the initial "Created" event using the on-chain `Clock`.
  - `add_event`: Appends a new event to the item's history vector.
  - `transfer_item`: Facilitates ownership changes.

### [Frontend Integration]
- **Codegen**: Generate TypeScript bindings for the `chain_passport` module.
- **dApp-Kit**: Map the deployed package ID in `src/dApp-kit.ts`.
- **CreatePage UI**: Refactor the form to execute on-chain transactions using `CurrentAccountSigner`.

## Verification Plan
- Successful build and publication via Sui CLI.
- Type checking with `tsc` to ensure binding compatibility.
- Manual verification of object creation on Sui Testnet.
