# project_spec.md

## Project Name
**ChainPassport**

A SUI-based provenance and traceability web app for food origin tracking, with future support for luxury item authentication.

---

## 1. Project Overview

### 1.1 Purpose
ChainPassport lets producers register food batches on-chain, logistics users add custody updates, and consumers or school admins verify origin by scanning a QR code. The app is designed as a digital passport for physical items, making the history of an item easy to trust and easy to read.

### 1.2 Product Vision
The app should feel like a provenance verification tool, not a crypto app. It should be simple enough for non-technical users, especially school admins and consumers, while still being useful for producers and logistics operators.

### 1.3 MVP Goal
The MVP should support wallet connect, batch creation, on-chain provenance recording, event history updates, QR generation, QR scanning, item detail pages, and role-based dashboard views.

---

## 2. Target Users

### 2.1 Producer
Creates a batch, enters origin information, and mints the on-chain record.

### 2.2 Logistics / Distributor
Adds transport or custody updates such as location, status, and temperature.

### 2.3 School Admin / Buyer
Verifies batch origin, reviews compliance, and checks whether a batch can be trusted.

### 2.4 Consumer
Scans a QR code and reads the origin timeline in a mobile-friendly view.

### 2.5 Future: Luxury Item Verifier
Uses the same system pattern to verify authenticity and ownership history for luxury goods.

---

## 3. Core Product Experience

### 3.1 Primary User Journey
1. Producer opens the app.
2. Connects SUI wallet.
3. Creates a food batch with origin metadata.
4. System mints a SUI object and generates a QR code.
5. Logistics users add updates over time.
6. School admin or consumer scans QR.
7. App shows the full batch history in a timeline view.

### 3.2 Secondary Journeys
- Search a batch by ID.
- View all created or owned batches.
- Add a new custody event.
- Review trust/compliance status.
- Share batch history link.

---

## 4. Functional Scope

### 4.1 Authentication and Wallet
- Connect SUI wallet.
- Detect connected account.
- Store selected role in local state.
- Protect write actions based on wallet connection.
- Use read-only access for public scan pages.

### 4.2 Batch Creation
- Create a new product batch.
- Enter:
  - product name,
  - category,
  - quantity,
  - origin farm,
  - province/region,
  - optional image,
  - optional certification note.
- Mint a corresponding on-chain object.
- Generate QR code from the object ID.

### 4.3 Batch History
- Store a sequence of events.
- Show event history as a timeline.
- Include event type, timestamp, location, and notes.
- Display status badges such as:
  - Created,
  - In Transit,
  - Delivered,
  - Verified.

### 4.4 Custody Updates
- Add an event to an existing batch.
- Update owner or custodian.
- Add transport or temperature info.
- Record who performed the action.

### 4.5 Scan and View
- Scan QR from camera on mobile.
- Open item detail page.
- Show metadata and event timeline.
- Show verification status and batch ID.

### 4.6 Dashboard
- Role-based dashboard views.
- Producer view: created items, create new batch.
- Logistics view: update batches.
- School view: verify batches, search, list, filter.
- Consumer view: scan and view only.

---

## 5. Move Smart Contract Scope

### 5.1 Contract Purpose
The Move package should model each batch as an on-chain object and keep its event history attached to that object.

### 5.2 Main On-Chain Objects
- `OriginItem`
- `OriginEvent`

### 5.3 Required Functions
- `create_origin_item`
- `add_event`
- `transfer_owner`

### 5.4 Contract Principles
- Keep the contract minimal.
- Use JSON-encoded strings for fast implementation.
- Prioritize hackathon speed over heavy abstraction.
- Emit events for frontend syncing.

### 5.5 Data Stored On-Chain
- object ID,
- creator,
- current owner,
- batch metadata,
- event history.

### 5.6 Security Assumption
For MVP, only the current owner can add or transfer updates. More advanced role and permission systems can be added later.

---

## 6. Frontend Scope

### 6.1 Frontend Stack
- Vite
- React
- TypeScript
- Tailwind CSS
- shadcn/ui
- @mysten/dapp-kit
- SUI testnet integration
- QR code generation and scanning libraries
- React Router

### 6.2 Pages
- `/` landing page
- `/dashboard`
- `/create`
- `/scan`
- `/item/:id`

### 6.3 Core Components
- Header
- Footer
- Wallet connect button
- Role selector
- Batch card
- Timeline component
- Event form
- QR code card
- QR scanner modal/page
- Empty state component
- Loading skeletons
- Status badge

### 6.4 UX Requirements
- Mobile-first.
- Clean and trustworthy.
- Fast to understand without crypto knowledge.
- Strong emphasis on provenance and confidence.
- Simple visual language with green as the trust color.

---

## 7. Design Direction

### 7.1 Visual Style
- minimal
- clean
- modern
- soft neutral backgrounds
- green accent color
- clear card layouts
- readable type
- strong spacing

### 7.2 Feel
The app should feel like:
- a product passport,
- a verification tool,
- a trustworthy supply chain record,
- not a trading app or speculative crypto UI.

### 7.3 UI Principles
- Make scan action obvious.
- Make history easy to understand.
- Make trust status visible.
- Keep forms short.
- Reduce blockchain jargon in visible UI.

---

## 8. Information Architecture

### 8.1 Navigation
- Home
- Dashboard
- Create Batch
- Scan QR
- My Items

### 8.2 Dashboard Views
#### Producer
- Create new batch
- View created batches
- See QR codes

#### Logistics
- View assigned batches
- Add updates
- Transfer custody

#### School Admin
- Search by batch ID
- Review history
- Verify origin
- Export or share summary

#### Consumer
- Scan QR
- View batch story
- Read origin information

---

## 9. User Stories

### 9.1 Producer
- As a producer, I want to register a batch so that I can prove where it came from.
- As a producer, I want to generate a QR code so that others can verify the batch quickly.

### 9.2 Logistics
- As a logistics operator, I want to add transport updates so that the batch history stays complete.
- As a logistics operator, I want to transfer custody so that ownership changes are recorded.

### 9.3 School Admin
- As a school admin, I want to verify product origin so that I can trust the food source.
- As a school admin, I want to search batches so that I can quickly inspect multiple items.

### 9.4 Consumer
- As a consumer, I want to scan a QR code so that I can see the product history.
- As a consumer, I want a simple timeline so that I can understand the journey instantly.

---

## 10. MVP Feature List

### Must Have
- wallet connection
- batch creation
- QR generation
- QR scanning
- timeline display
- update event creation
- role-based dashboard
- SUI testnet integration

### Nice to Have
- image upload
- certificate attachment
- analytics charts
- PDF export
- offline-friendly view
- multilingual UI

### Out of Scope for MVP
- full enterprise permission system
- IoT sensor integration
- real-time map tracking
- complex inventory management
- luxury goods support in the first demo

---

## 11. Success Criteria

### Functional
- Users can connect a wallet.
- Users can create a batch on testnet.
- Users can scan a QR and view the item page.
- Users can see a timeline of events.
- Users can add an update to a batch.

### UX
- A non-technical user can understand the app in under 30 seconds.
- The scan-to-history flow feels fast and clean.
- The UI looks polished enough for a hackathon demo.

### Technical
- Frontend and contract are working together.
- Object IDs are queryable from the UI.
- Data display is consistent and readable.

---

## 12. Implementation Priorities

### Phase 1
- project setup
- UI shell
- wallet connection
- base routing

### Phase 2
- Move contract creation
- batch minting
- event history storage

### Phase 3
- QR generation
- scanner flow
- item detail page

### Phase 4
- dashboard views
- role separation
- visual polish

### Phase 5
- demo readiness
- bug fixing
- deployment

---

## 13. Suggested Repo Conventions

### Frontend
- keep components small and reusable
- place shared UI in `src/components/ui`
- keep page logic in route components
- use TypeScript interfaces for item data

### Move
- store source in a single module folder
- keep the first contract version intentionally minimal
- prefer clarity over abstraction

### Documentation
- maintain this file as the single source of truth for product scope
- keep DESIGN.md as the visual source of truth
- add a short README for setup and demo flow

---

## 14. Final Product Definition

ChainPassport is a provenance verification web app that lets producers create verifiable batches, logistics teams update the batch journey, and schools or consumers scan QR codes to read a trusted origin timeline. The first version focuses on food safety and traceability, but the same architecture can later support luxury authenticity and other provenance-based domains.