import { useEffect } from 'react';
import { useCurrentAccount } from '@mysten/dapp-kit-react';
import { useStore } from '@nanostores/react';
import { $zkLoginSession } from '../../store/zkLoginStore';

/**
 * AuthSync is a headless component that ensures only one authentication 
 * method is active at a time (Mutual Exclusivity).
 */
export function AuthSync() {
  const account = useCurrentAccount();
  const session = useStore($zkLoginSession);

  useEffect(() => {
    // If a wallet account is connected, automatically clear any active zkLogin session
    if (account && session) {
      console.log('Wallet connected, clearing zkLogin session for mutual exclusivity.');

      // Clear zkLogin ephemeral keys and session
      sessionStorage.removeItem('zklogin-ephemeral-key');
      sessionStorage.removeItem('zklogin-max-epoch');
      sessionStorage.removeItem('zklogin-randomness');
      $zkLoginSession.set(null);
    }
  }, [account, session]);

  return null;
}
