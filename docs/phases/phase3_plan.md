# Implementation Plan: Phase 3 - QR Connectivity & Dynamic Detail Views

This phase bridges the physical-to-digital gap by implementing live data fetching, QR code generation, and a functional camera scanner.

## Proposed Changes

### [Backend/Sui Integration]
- **`useBatchData` Hook**: Implement a custom hook using `@mysten/dapp-kit-react` and `@tanstack/react-query` to fetch `OriginItem` objects by ID.
- **BCS/JSON Parsing**: Extract and format the `history` vector and metadata fields for UI display.

### [Frontend Components]
- **`ItemDetailPage.tsx`**: Update to use live blockchain data.
- **QR Generator**: Integrate `react-qr-code` to generate a "Passport" link for every batch.
- **`ScanPage.tsx`**: Integrate `html5-qrcode` to enable real-time camera scanning and redirection.

## Verification Plan
- Verify that a minted batch ID displays correctly in the Detail page.
- Test the QR code with a phone camera to ensure it points to the correct URL.
- Test the web scanner with the generated QR code.
