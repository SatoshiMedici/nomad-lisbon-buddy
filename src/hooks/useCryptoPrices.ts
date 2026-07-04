import { useState, useEffect, useCallback } from 'react';

export type CryptoPrice = {
  eth: number | null;
  btc: number | null;
  usdc: number | null;
};

type PriceData = {
  ethereum: { eur: number };
  bitcoin: { eur: number };
  'usd-coin': { eur: number };
};

const CACHE_KEY = 'nlb_crypto_prices';
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

function loadCachedPrices(): { data: CryptoPrice; timestamp: number } | null {
  try {
    const raw = localStorage.getItem(CACHE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (Date.now() - parsed.timestamp < CACHE_DURATION) {
      return parsed;
    }
  } catch {
    // ignore parse errors
  }
  return null;
}

function saveCachedPrices(data: CryptoPrice) {
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify({ data, timestamp: Date.now() }));
  } catch {
    // ignore storage errors
  }
}

export function useCryptoPrices() {
  const [prices, setPrices] = useState<CryptoPrice>({
    eth: null,
    btc: null,
    usdc: null,
  });
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<number | null>(null);

  const fetchPrices = useCallback(async () => {
    // Check cache first
    const cached = loadCachedPrices();
    if (cached) {
      setPrices(cached.data);
      setLastUpdated(cached.timestamp);
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(
        'https://api.coingecko.com/api/v3/simple/price?ids=ethereum,bitcoin,usd-coin&vs_currencies=eur'
      );
      if (!response.ok) throw new Error('Failed to fetch prices');
      const data: PriceData = await response.json();
      const newPrices: CryptoPrice = {
        eth: data.ethereum?.eur ?? null,
        btc: data.bitcoin?.eur ?? null,
        usdc: data['usd-coin']?.eur ?? null,
      };
      setPrices(newPrices);
      setLastUpdated(Date.now());
      saveCachedPrices(newPrices);
    } catch (err) {
      // If fetch fails, try to use stale cache as fallback
      try {
        const raw = localStorage.getItem(CACHE_KEY);
        if (raw) {
          const parsed = JSON.parse(raw);
          setPrices(parsed.data);
          setLastUpdated(parsed.timestamp);
        }
      } catch {
        // ignore
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPrices();
    // Refresh every 5 minutes
    const interval = setInterval(fetchPrices, CACHE_DURATION);
    return () => clearInterval(interval);
  }, [fetchPrices]);

  return { prices, loading, lastUpdated, refetch: fetchPrices };
}
