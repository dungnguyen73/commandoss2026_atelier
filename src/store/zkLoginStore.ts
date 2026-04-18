import { atom } from 'nanostores';

export type ZkLoginSession = {
  suiAddress: string;       // derived stable address
  jwt: string;              // raw JWT from Google
  salt: string;             // user salt (bigint serialised)
  decodedJwt: { sub: string; email?: string; name?: string; picture?: string };
  proof?: any;
};

// Helper: safe JSON parse
const loadSession = (): ZkLoginSession | null => {
  try {
    const stored = sessionStorage.getItem('atelier-zklogin-session');
    if (!stored) return null;
    return JSON.parse(stored);
  } catch (e) {
    return null;
  }
};

export const $zkLoginSession = atom<ZkLoginSession | null>(loadSession());

// Sync updates back to sessionStorage so redirect logic can read it on next page loads
$zkLoginSession.listen((session) => {
  if (session) {
    sessionStorage.setItem('atelier-zklogin-session', JSON.stringify(session));
  } else {
    sessionStorage.removeItem('atelier-zklogin-session');
  }
});
