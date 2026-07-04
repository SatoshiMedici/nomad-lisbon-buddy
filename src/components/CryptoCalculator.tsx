import { useState } from 'react';
import { Activity, RefreshCw, Wallet, Clock } from 'lucide-react';
import type { CryptoPrice } from '../hooks/useCryptoPrices';
import { shortenAddress } from '../hooks/useWallet';

type CurrencyKey = 'EUR' | 'ETH' | 'BTC' | 'USDC';

type ExpenseItem = {
  label: string;
  amount: number;
};

const expenses: ExpenseItem[] = [
  { label: 'Rent (studio, central)', amount: 1000 },
  { label: 'Groceries', amount: 250 },
  { label: 'Transport (monthly pass)', amount: 40 },
  { label: 'Coworking', amount: 150 },
  { label: 'Eating out and social', amount: 200 },
  { label: 'Utilities and internet', amount: 100 },
];

const total = expenses.reduce((sum, e) => sum + e.amount, 0);

const currencies: { key: CurrencyKey; label: string }[] = [
  { key: 'EUR', label: 'EUR' },
  { key: 'ETH', label: 'ETH' },
  { key: 'BTC', label: 'BTC' },
  { key: 'USDC', label: 'USDC' },
];

type Props = {
  prices: CryptoPrice;
  loading: boolean;
  lastUpdated: number | null;
  walletAddress: string | null;
  isConnected: boolean;
};

function formatAmount(eur: number, currency: CurrencyKey, prices: CryptoPrice): string {
  if (currency === 'EUR') return `€${eur.toFixed(2)}`;
  const priceKey = currency.toLowerCase() as keyof CryptoPrice;
  const price = prices[priceKey];
  if (!price) return '—';
  const converted = eur / price;
  if (currency === 'USDC') return `${converted.toFixed(2)} USDC`;
  if (currency === 'ETH') return `${converted.toFixed(4)} ETH`;
  if (currency === 'BTC') return `${converted.toFixed(6)} BTC`;
  return `€${eur.toFixed(2)}`;
}

export default function CryptoCalculator({
  prices,
  loading,
  lastUpdated,
  walletAddress,
  isConnected,
}: Props) {
  const [currency, setCurrency] = useState<CurrencyKey>('EUR');

  const hasPrices =
    prices.eth !== null && prices.btc !== null && prices.usdc !== null;

  return (
    <section
      className="mb-6 animate-fade-in-up"
      style={{ animationDelay: '0.5s' }}
    >
      <div className="glass rounded-2xl p-6">
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-3">
            <span className="w-10 h-10 rounded-xl bg-[var(--accent-glow)] flex items-center justify-center">
              <Activity className="w-5 h-5 text-[var(--accent)]" />
            </span>
            <div>
              <h3 className="text-base font-bold leading-tight">
                Crypto Cost Calculator
              </h3>
              <p className="text-xs text-[var(--muted)] mt-0.5">
                Typical monthly costs in Lisbon
              </p>
            </div>
          </div>
          {loading && (
            <RefreshCw className="w-4 h-4 text-[var(--muted)] animate-spin" />
          )}
        </div>

        {isConnected && walletAddress && (
          <div className="flex items-center gap-2 mb-4 px-3 py-2 rounded-xl bg-[var(--accent-glow)]">
            <Wallet className="w-4 h-4 text-[var(--accent)]" />
            <span className="text-xs font-medium text-[var(--accent)]">
              Connected: {shortenAddress(walletAddress)}
            </span>
          </div>
        )}

        <div className="flex gap-2 mb-5">
          {currencies.map((c) => {
            const isActive = currency === c.key;
            const disabled = c.key !== 'EUR' && !hasPrices;
            return (
              <button
                key={c.key}
                onClick={() => setCurrency(c.key)}
                disabled={disabled}
                className={`flex-1 py-2 px-3 rounded-xl text-sm font-semibold transition-all ${
                  isActive
                    ? 'bg-[var(--accent)] text-white shadow-[0_4px_16px_var(--accent-glow)]'
                    : 'text-[var(--muted)] hover:text-[var(--accent)] hover:bg-[var(--accent-glow)]'
                } ${disabled ? 'opacity-40 cursor-not-allowed' : ''}`}
              >
                {c.label}
              </button>
            );
          })}
        </div>

        <div className="space-y-2.5">
          {expenses.map((item, i) => (
            <div
              key={i}
              className="flex items-center justify-between py-2 border-b border-[var(--border)] last:border-0"
            >
              <span className="text-sm text-[var(--muted)]">{item.label}</span>
              <span className="text-sm font-semibold text-[var(--text)] tabular-nums">
                {formatAmount(item.amount, currency, prices)}
              </span>
            </div>
          ))}
        </div>

        <div className="flex items-center justify-between mt-4 pt-4 border-t-2 border-[var(--accent)]">
          <span className="text-sm font-bold text-[var(--text)]">
            Total / month
          </span>
          <span className="text-lg font-bold text-[var(--accent)] tabular-nums">
            {formatAmount(total, currency, prices)}
          </span>
        </div>

        {lastUpdated && (
          <div className="flex items-center gap-1.5 mt-4 text-xs text-[var(--muted)]">
            <Clock className="w-3 h-3" />
            <span>
              Prices updated{' '}
              {new Date(lastUpdated).toLocaleTimeString([], {
                hour: '2-digit',
                minute: '2-digit',
              })}
            </span>
          </div>
        )}

        {currency !== 'EUR' && !hasPrices && !loading && (
          <p className="text-xs text-[var(--muted)] mt-3 text-center">
            Live prices unavailable right now. Showing EUR instead.
          </p>
        )}
      </div>
    </section>
  );
}
