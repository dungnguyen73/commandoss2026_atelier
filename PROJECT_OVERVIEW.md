# Project Overview

**The Atelier** is a SUI-based provenance and authenticity web application designed for artisan products. 

## Goal
The goal of the project is to provide artisans with a simple, zero-trust way to register physical pieces on the blockchain. By minting a digital certificate of authenticity and generating a verifiable QR code, artisans can assure buyers of the origin of their work.

## Core Mechanisms
1. **Creation:** Artisans connect a SUI wallet and mint a certificate containing metadata about the piece.
2. **Immutable Trust:** A cryptographic SHA-256 hash is generated from the certificate metadata and permanently anchored on-chain.
3. **Verification:** Buyers can scan a QR code holding the certificate ID. The frontend queries the blockchain, reads the metadata, re-computes the hash, and strictly verifies it against the immutable on-chain record to ensure no data spoofing has occurred.
4. **Lineage:** The physical owner can transfer the SUI token to subsequent buyers, building a transparent on-chain history (provenance timeline) of the item's lifecycle.
