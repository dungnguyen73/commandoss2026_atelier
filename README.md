# The Atelier

> **Artisan authenticity and certificate verification on the SUI blockchain.**

The Atelier lets artisans mint tamper-proof digital certificates for handmade pieces, anchor them on-chain, and give every buyer or collector instant, trustless proof of authenticity — verified with a single QR scan.

**Live Demo:** [https://dungnguyen73.github.io/commandoss2026_atelier/](https://dungnguyen73.github.io/commandoss2026_atelier/)

---

## What it does

| Role | What they can do |
|---|---|
| **Artisan** | Connect wallet, mint a certificate, add provenance events |
| **Owner** | Hold the certificate, transfer it to a buyer |
| **Verifier** | Scan a QR code and verify the certificate hash matches on-chain |
| **Buyer / Marketplace** | Receive a transferred certificate, re-sell or display it |

### Certificate lifecycle
`Created → Certified → Transferred → Verified / Tampered → Closed`

---

## Tech stack

| Layer | Technology |
|---|---|
| Frontend | React 18 + Vite + TypeScript |
| Styling | Tailwind CSS 4.0 |
| Animations | Framer Motion |
| Wallet | `@mysten/dapp-kit-react` |
| Blockchain | SUI testnet (JSON-RPC) |
| Smart contract | Move (`move/atelier/`) |
| QR | `react-qr-code` + `html5-qrcode` |

---

## Certificate fields

| Field | Description |
|---|---|
| `name` | Display name of the handmade piece |
| `category` | Craft type — Ceramics, Jewelry, Textiles, Leather, Woodwork, Glass, Painting, Other |
| `artisan_name` | Full name of the creator |
| `location` | Studio, city, or region where the piece was made |
| `materials` | Primary materials used |
| `note` | Provenance story or technique note (optional) |
| `cert_hash` | SHA-256 hex digest of the canonical certificate data |
| `status` | Current lifecycle status |
| `history` | Ordered list of on-chain provenance events |

---

## Move package

The smart contract lives at `move/atelier/`.

```
move/atelier/
  Move.toml
  sources/
    atelier.move        # ArtisanCertificate object, all entry functions
    atelier_tests.move  # 7 unit tests covering full lifecycle
```

### Key entry functions

| Function | Description |
|---|---|
| `create_certificate` | Mints a new certificate and transfers it to the artisan |
| `certify` | Marks status as "Certified" and appends a provenance event |
| `add_provenance_event` | Owner appends a custom provenance update |
| `update_cert_hash` | Owner updates the certificate hash (e.g. after adding a photo) |
| `transfer_certificate` | Transfers ownership + appends "Transferred" event |
| `close_certificate` | Marks the certificate as "Closed" |

### Run tests

```bash
cd move/atelier
sui move test
```

### Publish to testnet

```bash
cd move/atelier
sui client publish --gas-budget 100000000
```

---

## Project routes

| Path | Page |
|---|---|
| `/` | Landing page |
| `/dashboard` | Artisan dashboard (Artisan / Owner / Verifier / Buyer tabs) |
| `/create` | Create a new certificate |
| `/scan` | Scan or manually enter a certificate ID |
| `/item/:id` | Certificate detail + provenance timeline |

---

## Getting started

```bash
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173).

Connect your SUI testnet wallet (Slush or Sui Wallet browser extension) to start minting certificates.
