import { useState, useRef, useEffect } from 'react';
import { Wallet, X } from 'lucide-react';
import { shortenAddress } from '../hooks/useWallet';

type Props = {
  isConnected: boolean;
  address: string | null;
  onConnect: () => void;
  onDisconnect: () => void;
  error: string | null;
};

export default function WalletButton({
  isConnected,
  address,
  onConnect,
  onDisconnect,
  error,
}: Props) {
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!showMenu) return;
    const handleClick = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setShowMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [showMenu]);

  if (!isConnected) {
    return (
      <div className="flex flex-col items-end gap-1">
        <button
          onClick={onConnect}
          className="flex items-center gap-2 text-sm font-semibold text-white bg-[var(--accent)] px-4 py-2 rounded-xl hover:scale-105 hover:bg-[var(--accent-soft)] active:scale-95 transition-all shadow-[0_4px_16px_var(--accent-glow)]"
        >
          <Wallet className="w-4 h-4" />
          <span className="hidden sm:inline">Connect Wallet</span>
          <span className="sm:hidden">Connect</span>
        </button>
        {error && (
          <span className="text-xs text-[var(--error)] max-w-[200px] text-right">
            {error}
          </span>
        )}
      </div>
    );
  }

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setShowMenu(!showMenu)}
        className="flex items-center gap-2 text-sm font-semibold text-[var(--accent)] bg-[var(--accent-glow)] px-3 py-2 rounded-xl hover:bg-[var(--accent)] hover:text-white transition-all"
      >
        <span className="w-2 h-2 rounded-full bg-[var(--success)]" />
        <span className="tabular-nums">
          {address ? shortenAddress(address) : 'Connected'}
        </span>
      </button>
      {showMenu && (
        <div className="absolute right-0 top-full mt-2 glass rounded-xl p-1 min-w-[160px] shadow-[0_8px_32px_rgba(0,0,0,0.12)] z-50">
          <button
            onClick={() => {
              onDisconnect();
              setShowMenu(false);
            }}
            className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium text-[var(--error)] hover:bg-[var(--border)] transition-colors"
          >
            <X className="w-4 h-4" />
            Disconnect
          </button>
        </div>
      )}
    </div>
  );
}
