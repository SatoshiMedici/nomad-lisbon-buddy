import { useState } from 'react';
import {
  Star,
  ArrowUpRight,
  Check,
  AlertCircle,
  ExternalLink,
  Copy,
  RefreshCw,
  Wallet,
} from 'lucide-react';
import { useTippingContract } from '../hooks/useTippingContract';
import { shortenAddress } from '../hooks/useWallet';

type Props = {
  isConnected?: boolean;
  address?: string | null;
  onConnect?: () => void;
};

const PRESETS = ['0.001', '0.01', '0.05'];
const EXPLORER = 'https://explorer.0g.ai';

export default function TippingPanel({
  isConnected = false,
  address = null,
  onConnect,
}: Props) {
  const { recipientAddress, sendTip, status, isSending, txHash, error, reset } =
    useTippingContract(address);
  const [amount, setAmount] = useState('0.01');
  const [copied, setCopied] = useState(false);

  const copyRecipient = async () => {
    try {
      await navigator.clipboard.writeText(recipientAddress);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // clipboard unavailable
    }
  };

  return (
    <div className="glass rounded-2xl p-6 animate-fade-in-up">
      <div className="flex items-start gap-3 mb-5">
        <div className="w-10 h-10 rounded-xl bg-[var(--accent-glow)] flex items-center justify-center shrink-0">
          <Star className="w-5 h-5 text-[var(--accent)]" />
        </div>
        <div className="min-w-0">
          <h3 className="text-lg font-semibold text-[var(--text)]">Send a Tip</h3>
          <p className="text-sm text-[var(--muted)]">
            Support the creator directly on 0G Network.
          </p>
        </div>
      </div>

      <div className="flex items-center justify-between gap-3 rounded-xl border border-[var(--border)] bg-[var(--card)] px-3 py-2.5 mb-4">
        <div className="min-w-0">
          <p className="text-xs text-[var(--muted)] mb-0.5">Tips go directly to</p>
          <p className="text-sm font-medium text-[var(--text)] tabular-nums truncate">
            {shortenAddress(recipientAddress)}
          </p>
        </div>
        <button
          onClick={copyRecipient}
          className="shrink-0 flex items-center gap-1 text-xs font-medium text-[var(--muted)] hover:text-[var(--accent)] transition-colors"
        >
          {copied ? (
            <Check className="w-3.5 h-3.5" />
          ) : (
            <Copy className="w-3.5 h-3.5" />
          )}
          {copied ? 'Copied' : 'Copy'}
        </button>
      </div>

      {!isConnected ? (
        <div className="flex flex-col items-center justify-center text-center py-6 gap-3">
          <div className="w-12 h-12 rounded-full bg-[var(--accent-glow)] flex items-center justify-center">
            <Wallet className="w-6 h-6 text-[var(--accent)]" />
          </div>
          <p className="text-sm text-[var(--muted)] max-w-[240px]">
            Connect your wallet to send a tip. No contract deployment needed — 100% goes to the creator.
          </p>
          {onConnect && (
            <button
              onClick={onConnect}
              className="flex items-center gap-2 text-sm font-semibold text-white bg-[var(--accent)] px-4 py-2 rounded-xl hover:scale-105 active:scale-95 transition-all shadow-[0_4px_16px_var(--accent-glow)]"
            >
              <Wallet className="w-4 h-4" />
              Connect Wallet
            </button>
          )}
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          <div>
            <label className="block text-xs font-medium text-[var(--muted)] mb-2">
              Tip amount
            </label>
            <div className="flex items-stretch rounded-xl border border-[var(--border)] bg-[var(--card)] overflow-hidden focus-within:border-[var(--accent)] transition-colors">
              <input
                type="number"
                min="0"
                step="0.001"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                disabled={isSending}
                className="flex-1 bg-transparent px-3 py-2.5 text-sm font-medium text-[var(--text)] outline-none tabular-nums disabled:opacity-50"
              />
              <span className="flex items-center px-3 text-sm font-semibold text-[var(--muted)] bg-[var(--border)]">
                0G
              </span>
            </div>
            <div className="flex gap-2 mt-2">
              {PRESETS.map((p) => (
                <button
                  key={p}
                  onClick={() => setAmount(p)}
                  disabled={isSending}
                  className={`flex-1 text-xs font-medium py-1.5 rounded-lg border transition-all disabled:opacity-50 ${
                    amount === p
                      ? 'border-[var(--accent)] text-[var(--accent)] bg-[var(--accent-glow)]'
                      : 'border-[var(--border)] text-[var(--muted)] hover:border-[var(--accent)]'
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={() => sendTip(amount)}
            disabled={isSending || !amount}
            className="flex items-center justify-center gap-2 w-full text-sm font-semibold text-white bg-[var(--accent)] px-4 py-3 rounded-xl hover:scale-[1.02] active:scale-95 transition-all shadow-[0_4px_16px_var(--accent-glow)] disabled:opacity-60 disabled:hover:scale-100"
          >
            {isSending ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                Sending...
              </>
            ) : (
              <>
                <ArrowUpRight className="w-4 h-4" />
                Send {amount || '0'} 0G Tip
              </>
            )}
          </button>

          {status === 'success' && txHash && (
            <div className="flex flex-col gap-2 rounded-xl border border-[var(--success)]/30 bg-[var(--success)]/10 p-3 animate-fade-in-up">
              <div className="flex items-center gap-2 text-sm font-medium text-[var(--success)]">
                <Check className="w-4 h-4" />
                Tip sent successfully!
              </div>
              <a
                href={`${EXPLORER}/tx/${txHash}`}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1.5 text-xs text-[var(--muted)] hover:text-[var(--accent)] transition-colors"
              >
                <ExternalLink className="w-3.5 h-3.5 shrink-0" />
                <span className="truncate">{txHash}</span>
              </a>
              <button
                onClick={() => {
                  reset();
                  setAmount('0.01');
                }}
                className="self-start text-xs font-medium text-[var(--accent)] hover:underline"
              >
                Send another tip
              </button>
            </div>
          )}

          {status === 'error' && error && (
            <div className="flex items-start gap-2 rounded-xl border border-[var(--error)]/30 bg-[var(--error)]/10 p-3 animate-fade-in-up">
              <AlertCircle className="w-4 h-4 text-[var(--error)] shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="text-sm text-[var(--error)]">{error}</p>
                <button
                  onClick={reset}
                  className="text-xs font-medium text-[var(--error)] hover:underline mt-1"
                >
                  Try again
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
