import { useState } from 'react';
import { useZkLogin } from '../../hooks/useZkLogin';
import { Button } from '../ui/button';
import { Loader2, LogOut } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// SVG Icon for Google
const GoogleIcon = () => (
  <svg viewBox="0 0 24 24" width="24" height="24" xmlns="http://www.w3.org/2000/svg" className="mr-2 h-4 w-4">
    <g transform="matrix(1, 0, 0, 1, 27.009001, -39.238998)">
      <path fill="#4285F4" d="M -3.264 51.509 C -3.264 50.719 -3.334 49.969 -3.454 49.239 L -14.754 49.239 L -14.754 53.749 L -8.284 53.749 C -8.574 55.229 -9.424 56.479 -10.684 57.329 L -10.684 60.329 L -6.824 60.329 C -4.564 58.239 -3.264 55.159 -3.264 51.509 Z"/>
      <path fill="#34A853" d="M -14.754 63.239 C -11.514 63.239 -8.804 62.159 -6.824 60.329 L -10.684 57.329 C -11.764 58.049 -13.134 58.489 -14.754 58.489 C -17.884 58.489 -20.534 56.379 -21.484 53.529 L -25.464 53.529 L -25.464 56.619 C -23.494 60.539 -19.444 63.239 -14.754 63.239 Z"/>
      <path fill="#FBBC05" d="M -21.484 53.529 C -21.734 52.809 -21.864 52.039 -21.864 51.239 C -21.864 50.439 -21.724 49.669 -21.484 48.949 L -21.484 45.859 L -25.464 45.859 C -26.284 47.479 -26.754 49.299 -26.754 51.239 C -26.754 53.179 -26.284 54.999 -25.464 56.619 L -21.484 53.529 Z"/>
      <path fill="#EA4335" d="M -14.754 43.989 C -12.984 43.989 -11.404 44.599 -10.154 45.789 L -6.734 42.369 C -8.804 40.429 -11.514 39.239 -14.754 39.239 C -19.444 39.239 -23.494 41.939 -25.464 45.859 L -21.484 48.949 C -20.534 46.099 -17.884 43.989 -14.754 43.989 Z"/>
    </g>
  </svg>
);

export function ZkLoginButton() {
  const { initiateGoogleLogin } = useZkLogin();
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async () => {
    setIsLoading(true);
    try {
      await initiateGoogleLogin();
    } catch (err) {
      console.error(err);
      setIsLoading(false);
    }
  };

  return (
    <Button
      variant="outline"
      onClick={handleLogin}
      disabled={isLoading}
      className="bg-white hover:bg-slate-50 text-slate-700 shadow-sm transition-all"
    >
      {isLoading ? (
        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
      ) : (
        <GoogleIcon />
      )}
      Sign In
    </Button>
  );
}

export function ZkLoginUserBadge() {
  const { session, logout } = useZkLogin();
  const [showDropdown, setShowDropdown] = useState(false);

  if (!session) return null;

  const truncateAddress = (addr: string) => `${addr.slice(0, 6)}...${addr.slice(-4)}`;

  return (
    <div className="relative">
      <button 
        onClick={() => setShowDropdown(!showDropdown)}
        className="flex items-center gap-2 rounded-full border border-slate-200 bg-white p-1 pr-3 text-sm font-medium hover:bg-slate-50 transition-colors shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
      >
        {session.decodedJwt.picture ? (
          <img src={session.decodedJwt.picture} alt="Profile" className="h-7 w-7 rounded-full bg-slate-100" />
        ) : (
          <div className="flex h-7 w-7 items-center justify-center rounded-full bg-emerald-100 text-emerald-800">
            {session.decodedJwt.name?.charAt(0) || 'U'}
          </div>
        )}
        <span className="hidden md:inline-block max-w-[100px] truncate">
          {session.decodedJwt.name || 'User'}
        </span>
      </button>

      {/* Dropdown */}
      <AnimatePresence>
        {showDropdown && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 mt-2 w-64 origin-top-right rounded-2xl bg-white p-4 shadow-xl ring-1 ring-black/5 z-50 text-left"
          >
            <div className="flex flex-col gap-1 pb-3 border-b border-slate-100">
               <p className="font-semibold text-slate-800">{session.decodedJwt.name}</p>
               <p className="text-xs text-slate-500 break-words">{session.decodedJwt.email}</p>
            </div>
            
            <div className="py-3">
              <div className="rounded-lg bg-emerald-50/50 p-2.5 space-y-1">
                <p className="text-[10px] uppercase font-bold tracking-wider text-emerald-900/40">Sui Address</p>
                <p className="font-mono text-xs font-semibold text-emerald-800 break-all leading-tight">
                  {truncateAddress(session.suiAddress)}
                </p>
              </div>
            </div>

            <button
              onClick={() => {
                setShowDropdown(false);
                logout();
              }}
              className="flex w-full items-center gap-2 rounded-xl p-2 text-sm font-medium text-red-600 hover:bg-red-50 transition-colors"
            >
              <LogOut className="h-4 w-4" />
              Sign Out
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
