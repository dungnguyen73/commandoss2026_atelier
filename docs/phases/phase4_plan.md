# Phase 4 Implementation Plan: Ownership Transfer & Dashboard Integration

Phase 4 focuses on making the dashboard view data-driven and implementing ownership features that allow users to update the events on the items they possess or transfer them to others.

## Proposed Changes

### 1. Data Fetching Hooks
#### [NEW] [useOwnedBatches.ts](file:///d:/Study/SUILearning/chaintrace/trust-trace/src/hooks/useOwnedBatches.ts)
* Implements a React Query hook using `@mysten/dapp-kit-react` and `client.getOwnedObjects`.
* Filters returned objects strictly to the type of `chain_passport::OriginItem`.
* Fetches the `content` and extracts parsed batch definitions to map directly to the `BatchItem` model used by the frontend components.

### 2. Dashboard Integration
#### [MODIFY] [DashboardPage.tsx](file:///d:/Study/SUILearning/chaintrace/trust-trace/src/pages/DashboardPage.tsx)
* Integrates `useOwnedBatches(account?.address)` instead of `PLACEHOLDER_ITEMS`.
* Under the Producer tab, displays the actual batches owned by the current logged-in wallet.
* Displays appropriate loading indicators or fallback UI when objects are fetching or an error occurs.

### 3. Product Action Modals
#### [MODIFY] [ItemDetailPage.tsx](file:///d:/Study/SUILearning/chaintrace/trust-trace/src/pages/ItemDetailPage.tsx)
* Introduces a check `isOwner` that determines if the logged-in wallet is the designated owner of the SUI object (`batch.owner.AddressOwner === account.address`).
* Displays "Add Update" and "Transfer Item" buttons strictly for the owner.
* **Add Update Modal**: Simple overlay form requesting event type, location, and note, passing it to `addEvent({ arguments: [...] })`.
* **Transfer Modal**: Overlay form requesting the new `recipient` address, calling the generated `transferItem({ arguments: [...] })`.
* Refetches `useBatchData` actively upon successful updates or transfers.

## User Review Required

> [!IMPORTANT]  
> **MVP Permissions Limit**: Currently, as dictated by the `project_spec.md` MVP requirements, only the SUI Object **Owner** will be able to append logistical updates to a batch. Robust multi-party access (where non-owners add updates) would require upgrading the system to `SharedObjects` instead of `OwnedObjects`.
> 
> Proceeding ahead with the strict "Owner-Only Editing" logic for MVPs context.

## Open Questions
- Do we want to strictly keep the UI Role selector (Producer/Logistics/School/Consumer) at the top of the dashboard, or should the dashboard organically present the "owned items" view automatically once a wallet is connected? (I plan to keep the tabs to match the existing UI unless specified).

## Verification Plan

### Automated Tests
* Use `npx vitest run` to ensure nothing is broken. Optional hooks test.

### Manual Verification
* **Dashboard Tab**: Ensure the logged-in wallet lists exactly the items owned by them.
* **Item Details**: Confirm the owner can see the new action buttons. Verify adding an event correctly appends it to the `history` and visually reflects on the timeline. Verify transferring changes `isOwner` check for the original connected wallet.
