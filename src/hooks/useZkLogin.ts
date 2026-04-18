import { useStore } from '@nanostores/react';
import { $zkLoginSession, ZkLoginSession } from '../store/zkLoginStore';
import { $roleStore } from '../store/roleStore';
import { Ed25519Keypair } from '@mysten/sui/keypairs/ed25519';
import { generateRandomness, generateNonce, computeZkLoginAddress } from '@mysten/sui/zklogin';
import { GOOGLE_CLIENT_ID, ZK_REDIRECT_URI } from '../config/network';
import { decodeJwt } from '../lib/jwt';
import { useCurrentClient, useDAppKit } from '@mysten/dapp-kit-react';

const EPOCHS_DURATION = 2; // Keep key valid for this many epochs

export function useZkLogin() {
  const session = useStore($zkLoginSession);
  const suiClient = useCurrentClient();
  const dAppKit = useDAppKit();

  const initiateGoogleLogin = async () => {
    try {
      // 1. Fetch current epoch from the network
      const { systemState } = await suiClient.core.getCurrentSystemState();

      const currentEpoch = Number(systemState.epoch);
      const maxEpoch = currentEpoch + EPOCHS_DURATION;

      // Ensure wallet is disconnected to avoid identity conflict
      dAppKit.disconnectWallet();

      // 2. Generate ephemeral keypair and randomness
      const keypair = new Ed25519Keypair();
      const randomness = generateRandomness();

      // Save ephemeral keypair details in sessionStorage for when we return
      sessionStorage.setItem('zklogin-ephemeral-key', keypair.getSecretKey());
      sessionStorage.setItem('zklogin-max-epoch', maxEpoch.toString());
      sessionStorage.setItem('zklogin-randomness', randomness);

      // 3. Generate nonce
      const nonce = generateNonce(keypair.getPublicKey(), maxEpoch, randomness);

      // 4. Construct Google OAuth URL
      const params = new URLSearchParams({
        client_id: GOOGLE_CLIENT_ID,
        redirect_uri: ZK_REDIRECT_URI,
        response_type: 'id_token', // implicit flow
        scope: 'openid email profile',
        nonce: nonce,
      });

      const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`;

      // Redirect user to Google
      window.location.href = authUrl;
    } catch (e) {
      console.error('Failed to initiate zkLogin', e);
      throw e;
    }
  };

  const handleCallback = (hash: string) => {
    try {
      // 1. Extract id_token from the URL hash
      const params = new URLSearchParams(hash.replace('#', '?'));
      const jwt = params.get('id_token');

      if (!jwt) throw new Error('No id_token in URL');

      // 2. Decode the JWT
      const decodedJwt = decodeJwt(jwt);
      if (!decodedJwt || !decodedJwt.sub) throw new Error('Invalid JWT payload');

      // 3. Derive a deterministic app-specific salt (for hackathon purposes only)
      // In production, you would fetch this from a secure backend
      // sub is a unique string for the user id. We convert first 16 chars to string representation of BigInt
      let saltStr = '';
      for (let i = 0; i < Math.min(16, decodedJwt.sub.length); i++) {
        saltStr += decodedJwt.sub.charCodeAt(i).toString();
      }
      const salt = saltStr;

      // 4. Compute the user's permanent Sui address
      const suiAddress = computeZkLoginAddress({
        claimName: 'sub',
        claimValue: decodedJwt.sub,
        iss: decodedJwt.iss || 'https://accounts.google.com',
        aud: decodedJwt.aud || GOOGLE_CLIENT_ID,
        userSalt: salt,
        legacyAddress: false,
      });

      // 5. Save the session + update global roles
      const sessionData: ZkLoginSession = {
        suiAddress,
        jwt,
        salt,
        decodedJwt,
      };

      $zkLoginSession.set(sessionData);

      // Automatically set role to Verifier as per the feature spec
      $roleStore.set('Verifier');

      return sessionData;
    } catch (e) {
      console.error('Error handling zkLogin callback', e);
      throw e;
    }
  };

  const logout = () => {
    // Clear ephemeral keys
    sessionStorage.removeItem('zklogin-ephemeral-key');
    sessionStorage.removeItem('zklogin-max-epoch');
    sessionStorage.removeItem('zklogin-randomness');
    // Clear session store
    $zkLoginSession.set(null);
  };

  return {
    initiateGoogleLogin,
    handleCallback,
    logout,
    session,
  };
}
