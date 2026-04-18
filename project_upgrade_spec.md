# project_upgrade_spec.md

## Project Name
**The Atelier**

A SUI-based authenticity and provenance web app for artisan products, where creators mint a digital certificate of authenticity, anchor its hash on-chain, and let anyone verify the product later by scanning a QR code or pasting a certificate hash.

This upgrade phase moves The Atelier beyond MVP into a more premium, story-driven provenance experience with stronger UI/UX, clearer role separation, and better product presentation.

---

## 1. Upgrade Goal

### 1.1 Purpose
This upgrade phase improves The Atelier’s product experience so it feels like a premium authenticity and provenance platform rather than only a blockchain verification app.

### 1.2 Product Direction
The app should:
- present artisan products as collectible and meaningful,
- make authenticity easy to understand in seconds,
- highlight the story behind each piece,
- show clear ownership and provenance,
- and feel elegant, trustworthy, and polished.

### 1.3 Upgrade Outcome
The result should be a noticeably better experience for:
- artisans creating certificates,
- buyers verifying authenticity,
- owners managing transfer,
- and verifiers reviewing trust-sensitive items.

---

## 2. Upgrade Principles

### 2.1 Story First
Each item should feel human, unique, and traceable. The product page should emphasize the artisan story, the exact item identity, and the origin trail.

### 2.2 Trust First
Authenticity status must be visible immediately. The user should not need to understand blockchain details to know whether the item is verified, transferred, or suspicious.

### 2.3 Premium Feel
The UI should feel calm, refined, and collectible. It should use strong spacing, clear hierarchy, subtle motion, and polished cards rather than technical dashboard clutter.

### 2.4 Minimal Friction
The user journey should remain short and direct. The app must still work fast on desktop and mobile, with QR scanning and read-only verification remaining the easiest entry point.

---

## 3. Current Product Baseline

The current MVP already supports:
- wallet connection,
- certificate creation,
- hash anchoring on SUI,
- QR generation,
- QR scanning,
- certificate detail pages,
- ownership transfer,
- and role-based dashboard views.

This upgrade does not replace the MVP. It refines it.

---

## 4. Target Users

### 4.1 Artisan / Creator
Creates certificates, uploads product details, and presents the product story.

### 4.2 Current Owner / Holder
Views owned items, checks status, and transfers ownership.

### 4.3 Buyer / Collector
Scans QR codes and inspects authenticity before purchase.

### 4.4 Marketplace / Gallery / Reseller
Reviews provenance before listing, accepting, or reselling items.

### 4.5 Verifier / Expert Reviewer
Inspects certificate details, history, and authenticity signals in trust-sensitive situations.

---

## 5. Upgrade Scope

## 5.1 Story-Driven Product Pages
Each certificate page should include:
- product summary,
- artisan name,
- craft category,
- origin location,
- materials,
- note or story,
- image,
- authenticity status,
- and history timeline.

The page should feel like a premium product story page, not a raw data table.

### 5.1.1 Image Support
Image support is now part of this upgrade phase.

The product should support:
- optional cover image on certificate creation,
- image display on detail pages,
- image preview in dashboard cards,
- and image visibility in public verification pages.

If image storage is implemented off-chain, the image reference must be part of the certificate payload rules for this phase.

### 5.1.2 Image Handling Rules
- If an image is present in the certificate payload, it should be displayed consistently across pages.
- If image is missing, the UI should show a clean placeholder.
- If the image is part of the canonical certificate data, it must be included in the hash calculation.
- If image support is not yet on-chain, it must be treated as a clearly defined off-chain field with explicit upgrade rules.

---

## 6. Role and Dashboard Upgrade

### 6.1 Global Role Management
Move role state out of local component state and into a global store.

### 6.2 Roles
The app should support:
- Artisan,
- Owner,
- Buyer,
- Verifier.

These roles are presentation and workflow modes in the frontend. They guide which dashboard sections appear and which actions are emphasized.

### 6.3 Dashboard Views
#### Artisan View
- create new certificate,
- view created items,
- see certificate cards with image and story,
- access QR code generation.

#### Owner View
- view owned certificates,
- transfer items,
- review current authenticity status,
- inspect item history.

#### Buyer View
- show recent items,
- show trusted verification summaries,
- show scan entry point,
- hide duplicates already shown in owned items.

#### Verifier View
- search by hash or object ID,
- inspect timeline,
- compare certificate data against on-chain record,
- review authenticity result.

### 6.4 Recent Items
Recent Items should be rendered as a section inside the Buyer view rather than a separate top-level tab.

If an item already appears in another active view such as Owned, it should be hidden from Recent to avoid duplication.

---

## 7. Verification Experience

### 7.1 Verification Flow
The verification page should:
- open from QR or direct link,
- show the certificate image if available,
- display the item’s authenticity result,
- compare current data with the anchored hash,
- and present a readable trust summary.

### 7.2 Status Labels
The UI should clearly show:
- Verified,
- Transferred,
- Updated Verified,
- Tampered,
- Suspicious,
- Closed.

### 7.3 Result Messaging
The user should always understand:
- what was checked,
- what matched,
- and what failed.

The page should not rely on blockchain jargon to explain the result.

---

## 8. Ownership Transfer Upgrade

### 8.1 Transfer Feedback
Ownership transfer should feel complete and trustworthy.

After transfer, the UI should show:
- success confirmation,
- updated owner name,
- updated provenance entry,
- and a changed status badge.

### 8.2 History Update
Each transfer should append a visible provenance entry so the timeline reflects the change.

### 8.3 Owner-Centric Feedback
The current owner should be the only actor allowed to initiate transfer or record updates.

---

## 9. Visual Design Upgrade

### 9.1 Design Style
The interface should feel:
- minimal,
- modern,
- premium,
- calm,
- and highly readable.

### 9.2 Visual Language
Use:
- soft neutral backgrounds,
- green as the trust accent,
- strong card separation,
- clean typography,
- and subtle shadows.

### 9.3 Premium Feel
The interface should feel more like:
- a luxury provenance platform,
- a collectible certificate viewer,
- or a high-end product authenticity page.

It should not feel like a crypto wallet dashboard.

### 9.4 UI Polishing Requirements
- better empty states,
- better loading skeletons,
- better certificate cards,
- improved banner states,
- smoother transitions,
- clearer button hierarchy,
- and more refined spacing.

---

## 10. Information Architecture

### 10.1 Main Navigation
- Home
- Dashboard
- Create Certificate
- Scan QR
- My Certificates

### 10.2 Dashboard Sections
#### Artisan
- Created certificates
- New certificate action
- QR access

#### Owner
- Owned certificates
- Transfer action
- History view

#### Buyer
- Recent items
- Scan entry
- Verification summaries

#### Verifier
- Search and inspect
- Timeline review
- Authenticity result

---

## 11. Functional Scope

### 11.1 Certificate Data
The certificate should support:
- product name,
- category,
- artisan name,
- location,
- materials,
- note/story,
- image,
- status,
- history,
- creator,
- created_at,
- and cert_hash.

### 11.2 Hashing Rule
The certificate hash should be computed from the canonical certificate payload that matches the implemented frontend and contract fields.

If image is part of the certificate payload for this phase, it must be included consistently in the canonical hash rules.

### 11.3 Public Verification
Public verification must remain read-only and accessible without requiring a wallet connection.

### 11.4 QR Support
QR should open the public verification route and point to a stable certificate identifier or verification link.

---

## 12. Move Contract Scope

### 12.1 Contract Intent
The Move contract should continue to represent certificates as on-chain objects with provenance history attached.

### 12.2 Contract Direction
Keep the contract minimal. Do not introduce enterprise permission systems in this phase.

### 12.3 Expected Functions
- create certificate,
- add provenance event,
- update certificate hash,
- transfer certificate,
- close certificate.

### 12.4 Contract Rule
The contract should remain a trust anchor, while the frontend handles the richer story and presentation layer.

---

## 13. Frontend Scope

### 13.1 Frontend Stack
- Vite
- React
- TypeScript
- Tailwind CSS
- shadcn/ui
- `@mysten/dapp-kit`
- `@nanostores/react`
- SUI testnet integration
- QR generation and scanning libraries
- React Router

### 13.2 New Frontend Responsibilities
- global role store,
- premium item pages,
- Buyer Recent Items section,
- ownership transfer feedback,
- polished certificate cards,
- image display and placeholders,
- and better verification banners.

---

## 14. Out of Scope

This phase does not include:
- enterprise permission management,
- live image forensics,
- marketplace inventory tooling,
- analytics dashboards,
- PDF export,
- multilingual UI,
- offline-first sync,
- or complex collection management.

If image support is not fully implemented in contract storage, the upgrade should still define the UI behavior for image display, preview, and future extensibility.

---

## 15. Success Criteria

### 15.1 UX Success
- A non-technical buyer can understand the authenticity result in under 10 seconds.
- The product page feels premium and trustworthy.
- The story and image make the item feel collectible and unique.

### 15.2 Functional Success
- Certificates can still be created, verified, transferred, and reviewed.
- Image content is shown consistently where available.
- Role-based views work globally.
- Recent items do not duplicate owned items.

### 15.3 Product Success
- The app feels more like a provenance brand than a blockchain tool.
- The certificate page becomes a meaningful product experience.
- The system is strong enough for a polished demo and future expansion.

---

## 16. Implementation Priorities


### Phase 6
- premium certificate page,
- story card,
- image support,
- better empty states and cards.

### Phase 7
- ownership transfer feedback,
- verification polish,
- status banner improvements.

### Phase 8
- final visual refinement,
- motion polish,
- responsive layout cleanup.

---

## 17. Suggested Repo Conventions

### Frontend
- keep components small and reusable,
- place shared UI in `src/components/ui`,
- keep role logic in a global store,
- keep certificate presentation separate from certificate data fetching.

### Move
- keep the first contract version minimal,
- prefer clarity over abstraction,
- and avoid introducing unnecessary complexity.

### Documentation
- maintain this file as the upgrade source of truth,
- keep the original `project_spec.md` as the product baseline,
- and use a short changelog if scope shifts again.

---

## 18. Final Upgrade Definition

The Atelier upgrade phase transforms the app from a working MVP into a premium provenance experience.

It should combine:
- artisan story,
- product image,
- authenticity proof,
- ownership history,
- and elegant UI polish

into one clear, trustworthy, and collectible experience.

The goal is not just to verify products.  
The goal is to make authenticity feel valuable, human, and memorable.