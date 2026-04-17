# project_spec.md

## Project Name
**The Atelier**

A SUI-based authenticity and provenance web app for artisan products, where creators mint a digital certificate of authenticity, anchor its hash on-chain, and let anyone verify the product later by scanning a QR code or pasting a certificate hash.

---

## 1. Project Overview

### 1.1 Purpose
The Atelier lets artisans create verifiable product certificates on-chain, transfer ownership as the product moves through shops or buyers, and allow the public to confirm authenticity through a QR-based verification page.

### 1.2 Product Vision
The app should feel like a trust and authenticity tool, not a crypto app. It should be simple enough for buyers, collectors, gallery staff, or marketplace users to understand in seconds, while still being useful for artisans and product owners.

### 1.3 MVP Goal
The MVP should support wallet connect, certificate creation, on-chain hash anchoring, ownership transfer, public verification, QR generation, QR scanning, certificate detail pages, and role-based dashboard views.

---

## 2. Target Users

### 2.1 Artisan / Creator
Creates the original certificate, uploads product details and an image, and mints the authenticity record with a SUI wallet.

### 2.2 Current Owner / Holder
Holds the physical product after transfer, can transfer it to another party, and can view the authenticity record and history.

### 2.3 Buyer / Collector
Scans a QR code or enters a hash to verify whether the product is genuine or tampered.

### 2.4 Marketplace / Gallery / Reseller
Checks authenticity before listing, accepting, or reselling an item.

### 2.5 Verifier / Expert Reviewer
A knowledgeable reviewer who inspects the certificate, compares it to the on-chain record, and confirms authenticity for trust-sensitive cases.

---

## 3. Core Product Experience

### 3.1 Primary User Journey
1. Artisan opens the app.
2. Connects a SUI wallet.
3. Creates a digital certificate with product metadata and a photo.
4. System hashes the certificate and stores the hash on-chain.
5. QR code is generated and attached to the physical product.
6. The product is transferred to a shop, gallery, reseller, or buyer.
7. A buyer scans the QR code or enters the certificate hash.
8. The app shows the original certificate, on-chain timestamp, transfer history, and authenticity status.

### 3.2 Secondary Journeys
- Search a certificate by object ID or hash.
- View all created or owned certificates.
- Transfer ownership to another wallet.
- Review verification status and certificate history.
- Share a public verification link.

---

## 4. Functional Scope

### 4.1 Authentication and Wallet
- Connect SUI wallet.
- Detect connected account.
- Store selected role in local state.
- Protect write actions based on wallet connection.
- Use read-only access for public verification pages.

### 4.2 Certificate Creation
- Create a new product certificate.
- Enter:
  - product name,
  - category,
  - artisan name,
  - location,
  - materials,
  - optional image,
  - optional note or story.
- Hash the certificate payload.
- Mint a corresponding on-chain object.
- Generate QR code from the certificate or object ID.

### 4.3 Certificate History
- Store a sequence of events or ownership changes.
- Show history as a timeline.
- Include event type, timestamp, location, and notes.
- Display status badges such as:
  - Created,
  - Transferred,
  - Verified,
  - Tampered,
  - Closed.

### 4.4 Ownership Transfer
- Transfer the certificate or object to another wallet.
- Record the new holder on-chain.
- Use this for shop, gallery, reseller, or buyer handoff.
- Keep the current owner as the only actor allowed to transfer or update the record.

### 4.5 Scan and Verify
- Scan QR from camera on mobile and desktop app.
- Open public verification page.
- Show certificate metadata and timeline.
- Compare current certificate data against the on-chain hash.
- Show verification status and certificate ID.

### 4.6 Dashboard
- Role-based dashboard views.
- Artisan view: created certificates, create new certificate.
- Owner view: owned items, transfer certificate.
- Verifier view: search, scan, inspect details.
- Public view: read-only verification flow.

---

## 5. Move Smart Contract Scope

### 5.1 Contract Purpose
The Move package should model each certificate as an on-chain object and keep its authenticity history attached to that object.

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
- certificate metadata,
- event history,
- timestamp of issuance.

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
- `@mysten/dapp-kit`
- SUI testnet integration
- QR code generation and scanning libraries
- React Router

### 6.2 Pages
- `/` landing page
- `/dashboard`
- `/create`
- `/scan`
- `/item/:id`
- `/verify/:hash` or equivalent public verification route

### 6.3 Core Components
- Header
- Footer
- Wallet connect button
- Role selector
- Certificate card
- Timeline component
- Event form
- QR code card
- QR scanner modal/page
- Empty state component
- Loading skeletons
- Status badge
- Verification status banner

### 6.4 UX Requirements
- Web app for desktop and mobile.
- Clean and trustworthy.
- Fast to understand without blockchain knowledge.
- Strong emphasis on authenticity and confidence.
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
- a product authenticity tool,
- a certificate verification system,
- a trustworthy craftsmanship record,
- not a trading app or speculative crypto UI.

### 7.3 UI Principles
- Make scan action obvious.
- Make authenticity status visible.
- Make certificate history easy to understand.
- Keep forms short.
- Reduce blockchain jargon in visible UI.

---

## 8. Information Architecture

### 8.1 Navigation
- Home
- Dashboard
- Create Certificate
- Scan QR
- My Certificates

### 8.2 Dashboard Views
#### Artisan
- Create new certificate
- View created certificates
- See QR codes

#### Owner
- View owned certificates
- Transfer ownership
- Check verification status

#### Verifier
- Search by hash or certificate ID
- Review certificate history
- Verify authenticity
- Share summary

#### Consumer / Buyer
- Scan QR
- View certificate story
- Read authenticity information

---

## 9. User Stories

### 9.1 Artisan
- As an artisan, I want to register my product so that I can prove it is authentic.
- As an artisan, I want to generate a QR code so that buyers can verify it quickly.

### 9.2 Owner
- As a current owner, I want to transfer ownership so that the product history stays accurate.
- As a current owner, I want to view the certificate so that I can present proof to buyers.

### 9.3 Verifier
- As a verifier, I want to check whether the product is genuine so that I can trust what I am buying.
- As a verifier, I want to search certificates so that I can inspect them quickly.

### 9.4 Consumer / Buyer
- As a buyer, I want to scan a QR code so that I can see the certificate history.
- As a buyer, I want a simple authenticity result so that I can decide quickly.

---

## 10. MVP Feature List

### Must Have
- wallet connection
- certificate creation
- QR generation
- QR scanning
- timeline display
- ownership transfer
- public verification page
- role-based dashboard
- SUI testnet integration

### Nice to Have
- image upload
- artisan profile page
- verification analytics
- PDF export
- offline-friendly view
- multilingual UI

### Out of Scope for MVP
- full enterprise permission system
- live image forensics
- complex marketplace flows
- inventory management
- food traceability-specific fields

---

## 11. Success Criteria

### Functional
- Users can connect a wallet.
- Users can create a certificate on testnet.
- Users can scan a QR and view the certificate page.
- Users can see whether the certificate is verified or tampered.
- Users can transfer ownership of a certificate.

### UX
- A non-technical user can understand the app in under 30 seconds.
- The scan-to-verification flow feels fast and clean.
- The UI looks polished enough for a hackathon demo.

### Technical
- Frontend and contract are working together.
- Object IDs or hashes are queryable from the UI.
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
- certificate minting
- history storage

### Phase 3
- QR generation
- scanner flow
- item detail page
- public verification page

### Phase 4
- dashboard views
- role separation
- ownership transfer
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
- use TypeScript interfaces for certificate data

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

The Atelier is a provenance verification web app that lets artisans create verifiable product certificates, owners transfer the item through its lifecycle, and buyers or reviewers scan QR codes to read a trusted authenticity timeline. The first version focuses on artisan authenticity and tamper-proof verification, but the same architecture can later support collectibles, luxury goods, and other provenance-based domains.