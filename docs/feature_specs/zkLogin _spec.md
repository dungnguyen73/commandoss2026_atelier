# zkLogin Feature Spec — The Atelier

## Feature Name
**zkLogin Onboarding for Buyers and Verifiers**

---

## 1. Summary

Add zkLogin to The Atelier so users can sign in with familiar Web2 credentials, such as Google, without requiring immediate wallet setup. This improves onboarding for buyers, collectors, and verifiers while preserving Sui-native self-custody and privacy through zero-knowledge proofs.

---

## 2. Purpose

The current app assumes users are comfortable with wallet-based onboarding. That creates friction for non-technical users who only want to verify a product, view a certificate, or inspect provenance. zkLogin reduces that friction by allowing users to access the app through OAuth-based authentication and derive a Sui account from that login.

---

## 3. Goals

- Reduce onboarding friction for first-time users.
- Allow buyers and verifiers to enter the app with Google login.
- Preserve privacy and self-custody through zk proofs.
- Keep artisans on wallet-based onboarding for now.
- Make public verification feel consumer-friendly rather than crypto-native.

---

## 4. User Stories

### Buyer
As a buyer, I want to sign in with Google so that I can verify a product without installing a wallet.

### Verifier
As a verifier, I want quick access through OAuth so that I can inspect certificates with minimal setup.

### Artisan
As an artisan, I can continue using wallet connect so that my minting flow stays explicit and secure.

---

## 5. In Scope

- Google OAuth as the first supported provider.
- zkLogin account creation and address derivation.
- Callback handling after OAuth login.
- Ephemeral login state management on the client.
- Use of zkLogin for buyer/verifier access.
- Optional transaction signing for future write flows.[web:943][web:941]

---

## 6. Out of Scope

- Multi-provider OAuth in the first version.
- Replacing wallet connect for artisans.
- Advanced account merging.
- Complex permission management.
- Sponsored transactions unless explicitly added later.[web:932][web:952]

---

## 7. UX Flow

1. User opens The Atelier.
2. User clicks **Sign in with Google**.
3. OAuth redirects to the provider.
4. The app receives the JWT on return.
5. The app derives or loads the zkLogin Sui address.
6. The user lands in the correct dashboard or verification view.
7. Public verification remains available as a read-first path where appropriate.[web:943][web:939]

---

## 8. Functional Requirements

- The frontend must support OAuth initiation.
- The frontend must support redirect callback handling.
- The app must generate or retrieve the zkLogin address.
- The app must keep temporary login state safe during the auth flow.
- The app must be able to connect the zkLogin account to Sui actions if needed.
- The app must not block public verification pages behind login.[web:943][web:952]

---

## 9. Technical Notes

A React implementation may use a helper library such as `use-sui-zklogin` or a similar abstraction to simplify account retrieval, address resolution, and signature flow.[web:941][web:947]  
The feature will also require an OAuth client configuration, a prover endpoint, and a salt strategy.[web:943][web:960]

Recommended provider for the first version:
- Google

Recommended SDK support:
- Sui TypeScript SDK
- dApp Kit integration where useful[web:939][web:952]

---

## 10. Security Notes

- OAuth identity should never be treated as the on-chain authority by itself.
- The zk proof is what bridges Web2 identity to the Sui account.
- The login flow should preserve privacy and avoid exposing provider metadata on-chain.
- Ephemeral keys should remain client-side where possible.

---

## 11. UI Requirements

- Show a clear **Sign in with Google** action.
- Display a lightweight loading state during proof generation.
- Show a friendly success state after login.
- Make the flow feel simple and trustworthy.
- Keep the public verification route readable without requiring blockchain knowledge.[web:953][web:941]

---

## 12. Success Criteria

- A non-technical user can enter the app using Google login.
- The user does not need to install a wallet to verify items.
- The zkLogin flow completes successfully in the frontend.
- The UI feels smoother and more consumer-friendly.
- The feature improves onboarding without disrupting artisan minting.

---

## 13. Implementation Priority

### Phase 1
- Google OAuth login button.
- Redirect and callback handling.
- zkLogin address derivation.

### Phase 2
- Session persistence and restored login state.
- Dashboard role handoff.
- Optional transaction signing support.

### Phase 3
- UI polish, loading states, and error recovery.
- Better fallback flow when OAuth or proof generation fails.

---

## 14. Product Positioning

zkLogin should be positioned as an optional onboarding upgrade for buyers and verifiers, not as a replacement for wallet-based artisan flows. It exists to reduce friction, widen adoption, and make The Atelier feel more polished and accessible.

---

## 15. Final Definition

zkLogin adds a modern onboarding path to The Atelier by letting users sign in with Google and access the app through a Sui zkLogin account. It keeps the experience familiar for Web2 users while preserving the privacy and self-custody properties expected from a Sui-based product.