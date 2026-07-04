import { useState, useEffect, useCallback } from 'react';

type Eip1193Provider = {
  request: (args: { method: string; params?: unknown[] }) => Promise<unknown>;
  on?: (event: string, handler: (...args: unknown[]) => void) => void;
  removeListener?: (event: string, handler: (...args: unknown[]) => void) => void;
};

declare global {
  interface Window {
    ethereum?: Eip1193Provider;
  }
}

export function shortenAddress(addr: string): string {
  if (!addr || addr.length < 10) return addr;
  return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
}

export function useWallet() {
  const [address, setAddress] = useState<string | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAccountsChanged = useCallback((accounts: string[]) => {
    if (accounts.length === 0) {
      setAddress(null);
      setIsConnected(false);
    } else {
      setAddress(accounts[0]);
      setIsConnected(true);
    }
  }, []);

  useEffect(() => {
    const provider = window.ethereum;
    if (!provider) return;

    provider
      .request({ method: 'eth_accounts' })
      .then((accounts) => {
        handleAccountsChanged(accounts as string[]);
      })
      .catch(() => {
        // ignore
      });

    if (provider.on) {
      provider.on('accountsChanged', handleAccountsChanged);
    }

    return () => {
      if (provider.removeListener) {
        provider.removeListener('accountsChanged', handleAccountsChanged);
      }
    };
  }, [handleAccountsChanged]);

  const connect = useCallback(async () => {
    const provider = window.ethereum;
    if (!provider) {
      setError('No wallet found. Install MetaMask to connect.');
      return;
    }
    setError(null);
    try {
      const accounts = (await provider.request({
        method: 'eth_requestAccounts',
      })) as string[];
      handleAccountsChanged(accounts);
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Failed to connect wallet';
      setError(msg);
    }
  }, [handleAccountsChanged]);

  const disconnect = useCallback(() => {
    setAddress(null);
    setIsConnected(false);
    setError(null);
  }, []);

  return { address, isConnected, connect, disconnect, error };
}
