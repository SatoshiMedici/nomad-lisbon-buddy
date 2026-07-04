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

const ZG_NETWORK = {
  chainId: '0x4115',
  chainName: '0G Network',
  nativeCurrency: { name: '0G', symbol: '0G', decimals: 18 },
  rpcUrls: ['https://evmrpc.0g.ai'],
  blockExplorerUrls: ['https://explorer.0g.ai'],
};

async function ensure0GNetwork(provider: Eip1193Provider): Promise<void> {
  try {
    await provider.request({
      method: 'wallet_switchEthereumChain',
      params: [{ chainId: ZG_NETWORK.chainId }],
    });
  } catch (switchError) {
    const err = switchError as { code?: number };
    if (err.code === 4902) {
      await provider.request({
        method: 'wallet_addEthereumChain',
        params: [ZG_NETWORK],
      });
    } else {
      throw switchError;
    }
  }
}

export function useWallet() {
  const [address, setAddress] = useState<string | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [networkWarning, setNetworkWarning] = useState<string | null>(null);

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
    setNetworkWarning(null);
    try {
      const accounts = (await provider.request({
        method: 'eth_requestAccounts',
      })) as string[];
      handleAccountsChanged(accounts);
      try {
        await ensure0GNetwork(provider);
      } catch {
        setNetworkWarning(
          'Please switch to 0G Network (Chain ID 16661) to use on-chain tipping.'
        );
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Failed to connect wallet';
      setError(msg);
    }
  }, [handleAccountsChanged]);

  const disconnect = useCallback(() => {
    setAddress(null);
    setIsConnected(false);
    setError(null);
    setNetworkWarning(null);
  }, []);

  return { address, isConnected, connect, disconnect, error, networkWarning };
}
