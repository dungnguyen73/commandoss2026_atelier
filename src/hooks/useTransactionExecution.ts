import { useCurrentAccount, useCurrentClient, useDAppKit, CurrentAccountSigner } from "@mysten/dapp-kit-react";
import { useStore } from "@nanostores/react";
import { $zkLoginSession } from "../store/zkLoginStore";
import { Ed25519Keypair } from "@mysten/sui/keypairs/ed25519";
import { getZkLoginSignature } from "@mysten/sui/zklogin";
import { ZK_PROVER_URL } from "../config/network";
import type { Transaction } from "@mysten/sui/transactions";
import { useMemo } from "react";

export function useTransactionExecution() {
  const account = useCurrentAccount();
  const client = useCurrentClient();
  const dAppKit = useDAppKit();
  const session = useStore($zkLoginSession);

  const signer = useMemo(() => {
    if (dAppKit) {
      return new CurrentAccountSigner(dAppKit);
    }
    return null;
  }, [dAppKit]);

  const execute = async (tx: Transaction) => {
    // Case 1: Standard Wallet
    if (account && signer) {
      return await signer.signAndExecuteTransaction({
        transaction: tx,
      });
    }

    // Case 2: zkLogin Session
    if (session) {
      try {
        // 1. Get ephemeral key and randomness from sessionStorage
        const ephemeralSecretKey = sessionStorage.getItem('zklogin-ephemeral-key');
        const randomness = sessionStorage.getItem('zklogin-randomness');
        const maxEpoch = sessionStorage.getItem('zklogin-max-epoch');

        if (!ephemeralSecretKey || !randomness || !maxEpoch) {
          throw new Error("zkLogin session credentials missing in storage");
        }

        const ephemeralKeypair = Ed25519Keypair.fromSecretKey(ephemeralSecretKey);

        // 2. Build the transaction
        tx.setSender(session.suiAddress);
        const transactionBlockBytes = await tx.build({ client: client as any });

        // 3. Fetch ZK Proof from Prover
        // This is a time-consuming but necessary step for zkLogin execution
        const proofResponse = await fetch(ZK_PROVER_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            jwt: session.jwt,
            extendedEphemeralPublicKey: ephemeralKeypair.getPublicKey().toSuiPublicKey(),
            maxEpoch: Number(maxEpoch),
            jwtMeta: {
              claimName: 'sub',
              claimValue: session.decodedJwt.sub,
            },
            userSalt: session.salt,
            randomness: randomness,
          }),
        });

        if (!proofResponse.ok) {
          const errorText = await proofResponse.text();
          throw new Error(`Prover failed: ${errorText}`);
        }

        const zkProof = await proofResponse.json();

        // 4. Sign the transaction bytes with ephemeral key
        const { signature } = await ephemeralKeypair.signTransaction(transactionBlockBytes);

        // 5. Construct the zkLogin signature
        const zkLoginSignature = getZkLoginSignature({
          inputs: zkProof,
          maxEpoch: Number(maxEpoch),
          userSignature: signature,
        });

        // 6. Execute the transaction
        return await (client as any).core.executeTransactionBlock({
          transactionBlock: transactionBlockBytes,
          signature: zkLoginSignature,
          options: {
            showEffects: true,
            showEvents: true,
          },
        });
      } catch (e) {
        console.error("zkLogin execution failed:", e);
        throw e;
      }
    }

    throw new Error("No active session or wallet connected");
  };

  return {
    execute,
    isZkLogin: !!session,
    isConnected: !!account || !!session,
    address: account?.address || session?.suiAddress,
  };
}
