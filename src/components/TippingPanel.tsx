import { useState } from 'react';
import {
  Activity,
  Wallet,
  Lock,
  Check,
  Clock,
  Star,
  Shield,
  ArrowUpRight,
  TrendingUp,
  RefreshCw,
  Info,
  AlertCircle,
  Zap,
  User,
  AlertTriangle,
} from 'lucide-react';
import type { Tip } from '../hooks/useTippingContract';
import { shortenAddress } from '../hooks/useWallet';

type Props = {
  isConnected: boolean;
  contractAddress: string | null;
  isDeploying: boolean;
  deployError: string | null;
  deploy: () => void;
  tipCount: number;
  tips: Tip[];
  hasPremium: boolean;
  isSendingTip: boolean;
  tipError: string | null;
  lastTxHash: string | null;
  sendTip: (amountEth: string, message: string) => void;
  withdraw: () => void;
  isWithdrawing: boolean;
  isRecipient: boolean;
  recipientAddress: string | null;
  contractBalance: string;
  totalVolume: string;
  networkWarning: string | null;
};

const premiumTips = [
  {
    title: 'Secret viewpoints without the crowds',
    text: "Miradouro de Santa Catarina is packed at sunset — walk 5 min to Miradouro de São Pedro de Alcântara early morning for the same skyline, empty. Even better: Miradouro da Graça at sunrise is almost always deserted.",
  },
  {
    title: 'Authentic eats away from Time Out Market',
    text: "Skip the tourist markup at Time Out. Cervejaria Ramiro does legendary seafood (no reservations, queue at 7pm). A Travessa do Fado in Alfama serves dinner with live fado at local prices. For a cheap lunch, any tasca in Mouraria does prato do dia for €7–€9.",
  },
  {
    title: 'Free museum Sundays',
    text: "Most major museums are free on Sunday mornings until 2pm — Gulbenkian's modern collection, MAAT, and the Museu Nacional do Azulejo (Tile Museum) are all worth it. Go early; queues build by 11am.",
  },
  {
    title: 'Beat the Tram 28 crowds',
    text: "Tram 28 is a tourist trap on wheels. Take bus 712 for the same route at €1.80 with no crowds, or just walk downhill from Graça to Baixa — 25 minutes and the most beautiful stroll in the city.",
  },
  {
    title: 'Local discount tricks',
    text: "Get a Lisboa Card if you're museum-hopping — covers transport and entries. The Carris transport app gives 10% off monthly passes. Many frutarias drop prices after 7pm; bakeries discount bread after 8pm.",
  },
];

function timeAgo(ts: number): string {
  const diff = Date.now() / 1000 - ts;
  if (diff < 60) return 'just now';
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
}

function NetworkWarning({ warning }: { warning: string }) {
  return (
    <div className="flex items-start gap-2 p-3 rounded-xl bg-[var(--warning)]/10 border border-[var(--warning)]/30 mb-4">
      <AlertTriangle className="w-4 h-4 text-[var(--warning)] flex-shrink-0 mt-0.5" />
      <p className="text-xs text-[var(--warning)] font-medium leading-relaxed">
        {warning}
      </p>
    </div>
  );
}

function PremiumSection({ hasPremium }: { hasPremium: boolean }) {
  if (!hasPremium) {
    return (
      <div className="mt-5 rounded-2xl border border-dashed border-[var(--border)] p-5 bg-[var(--bg)]">
        <div className="flex items-center gap-2 mb-2">
          <Lock className="w-4 h-4 text-[var(--muted)]" />
          <span className="text-sm font-bold text-[var(--text)]">
            Premium Lisbon Tips — Locked
          </span>
        </div>
        <p className="text-xs text-[var(--muted)] leading-relaxed">
          Tip at least <strong className="text-[var(--accent)]">0.1 0G</strong>{' '}
          to unlock exclusive local knowledge — hidden viewpoints, crowd-free
          timing, authentic eats, and local discount tricks that most tourists
          never find.
        </p>
      </div>
    );
  }

  return (
    <div className="mt-5 rounded-2xl border border-[var(--accent)] p-5 bg-[var(--accent-glow)] animate-fade-in-up">
      <div className="flex items-center gap-2 mb-4">
        <span className="w-7 h-7 rounded-lg bg-[var(--accent)] flex items-center justify-center">
          <Check className="w-4 h-4 text-white" />
        </span>
        <span className="text-sm font-bold text-[var(--accent)]">
          Premium Lisbon Tips — Unlocked
        </span>
      </div>
      <div className="space-y-3">
        {premiumTips.map((tip, i) => (
          <div
            key={i}
            className="rounded-xl bg-[var(--surface)] p-3 border border-[var(--border)]"
          >
            <div className="flex items-center gap-2 mb-1">
              <Star className="w-3.5 h-3.5 text-[var(--accent)]" />
              <span className="text-xs font-bold text-[var(--text)]">
                {tip.title}
              </span>
            </div>
            <p className="text-xs text-[var(--muted)] leading-relaxed">
              {tip.text}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

function TipsList({ tips }: { tips: Tip[] }) {
  if (tips.length === 0) {
    return (
      <p className="text-xs text-[var(--muted)] text-center py-4">
        No tips yet. Be the first to support the buddy!
      </p>
    );
  }

  return (
    <div className="space-y-2 max-h-48 overflow-y-auto">
      {tips.map((tip, i) => (
        <div
          key={i}
          className="flex items-start gap-3 p-3 rounded-xl bg-[var(--bg)] border border-[var(--border)]"
        >
          <span className="flex-shrink-0 w-8 h-8 rounded-lg bg-[var(--accent-glow)] flex items-center justify-center">
            <Wallet className="w-4 h-4 text-[var(--accent)]" />
          </span>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between gap-2">
              <span className="text-xs font-semibold text-[var(--text)] tabular-nums">
                {shortenAddress(tip.sender)}
              </span>
              <span className="text-xs font-bold text-[var(--accent)] tabular-nums">
                {parseFloat(tip.amount).toFixed(4)} 0G
              </span>
            </div>
            {tip.message && (
              <p className="text-xs text-[var(--muted)] mt-1 leading-relaxed break-words">
                "{tip.message}"
              </p>
            )}
            <span className="text-[10px] text-[var(--muted)] mt-1 flex items-center gap-1">
              <Clock className="w-2.5 h-2.5" />
              {timeAgo(tip.timestamp)}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}

export default function TippingPanel(props: Props) {
  const [tipAmount, setTipAmount] = useState('0.1');
  const [tipMessage, setTipMessage] = useState('');

  const handleSendTip = () => {
    props.sendTip(tipAmount, tipMessage);
    setTipMessage('');
  };

  if (!props.isConnected) {
    return (
      <section
        className="mb-6 animate-fade-in-up"
        style={{ animationDelay: '0.5s' }}
      >
        <div className="glass rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <span className="w-10 h-10 rounded-xl bg-[var(--accent-glow)] flex items-center justify-center">
              <Activity className="w-5 h-5 text-[var(--accent)]" />
            </span>
            <div>
              <h3 className="text-base font-bold leading-tight">
                On-Chain Tipping
              </h3>
              <p className="text-xs text-[var(--muted)] mt-0.5">
                Tip in 0G tokens on 0G Network
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3 p-4 rounded-xl bg-[var(--bg)] border border-dashed border-[var(--border)]">
            <Wallet className="w-5 h-5 text-[var(--muted)] flex-shrink-0" />
            <p className="text-sm text-[var(--muted)]">
              Connect your wallet to deploy the tipping contract and send tips
              in 0G tokens on 0G Network mainnet.
            </p>
          </div>
        </div>
      </section>
    );
  }

  if (!props.contractAddress) {
    return (
      <section
        className="mb-6 animate-fade-in-up"
        style={{ animationDelay: '0.5s' }}
      >
        <div className="glass rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <span className="w-10 h-10 rounded-xl bg-[var(--accent-glow)] flex items-center justify-center">
              <Activity className="w-5 h-5 text-[var(--accent)]" />
            </span>
            <div>
              <h3 className="text-base font-bold leading-tight">
                On-Chain Tipping
              </h3>
              <p className="text-xs text-[var(--muted)] mt-0.5">
                Deploy the smart contract to get started
              </p>
            </div>
          </div>

          {props.networkWarning && (
            <NetworkWarning warning={props.networkWarning} />
          )}

          <div className="flex items-start gap-3 p-4 rounded-xl bg-[var(--accent-glow)] mb-4">
            <Info className="w-4 h-4 text-[var(--accent)] flex-shrink-0 mt-0.5" />
            <div className="text-xs text-[var(--text)] leading-relaxed">
              <p className="mb-2">
                <strong>Tips go directly to the creator's wallet.</strong>{' '}
                When users tip, 0G tokens are forwarded instantly to the
                recipient address — no withdrawal needed.
              </p>
              <p>
                This deploys on{' '}
                <strong className="text-[var(--accent)]">0G Network mainnet</strong>{' '}
                (Chain ID 16661). Make sure your wallet is connected to 0G
                Network. Tips are sent in 0G tokens.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 rounded-xl bg-[var(--bg)] border border-[var(--border)] mb-4">
            <span className="flex-shrink-0 w-8 h-8 rounded-lg bg-[var(--accent)] flex items-center justify-center">
              <User className="w-4 h-4 text-white" />
            </span>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-[var(--accent)]">
                Recipient (tips go here)
              </p>
              <p className="text-xs font-mono text-[var(--text)] truncate">
                0xD53aC13c75038545F8265c4AfAe41Bcb77c158c8
              </p>
            </div>
          </div>

          <button
            onClick={props.deploy}
            disabled={props.isDeploying}
            className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-[var(--accent)] text-white font-semibold text-sm hover:scale-[1.02] hover:bg-[var(--accent-soft)] active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_4px_16px_var(--accent-glow)]"
          >
            {props.isDeploying ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                Deploying contract…
              </>
            ) : (
              <>
                <ArrowUpRight className="w-4 h-4" />
                Deploy Tipping Contract
              </>
            )}
          </button>

          {props.deployError && (
            <div className="flex items-center gap-2 mt-3 p-3 rounded-xl bg-[var(--error)]/10 border border-[var(--error)]/20">
              <AlertCircle className="w-4 h-4 text-[var(--error)] flex-shrink-0" />
              <p className="text-xs text-[var(--error)]">{props.deployError}</p>
            </div>
          )}
        </div>
      </section>
    );
  }

  return (
    <section
      className="mb-6 animate-fade-in-up"
      style={{ animationDelay: '0.5s' }}
    >
      <div className="glass rounded-2xl p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <span className="w-10 h-10 rounded-xl bg-[var(--accent-glow)] flex items-center justify-center">
              <Activity className="w-5 h-5 text-[var(--accent)]" />
            </span>
            <div>
              <h3 className="text-base font-bold leading-tight">
                On-Chain Tipping
              </h3>
              <p className="text-xs text-[var(--muted)] mt-0.5">
                Contract: {shortenAddress(props.contractAddress)}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="flex items-center gap-1 text-xs font-semibold text-[var(--accent)] bg-[var(--accent-glow)] px-2.5 py-1 rounded-full">
              0G Network
            </span>
            <span className="flex items-center gap-1 text-xs font-semibold text-[var(--success)] bg-[var(--success)]/10 px-2.5 py-1 rounded-full">
              <span className="w-1.5 h-1.5 rounded-full bg-[var(--success)]" />
              Live
            </span>
          </div>
        </div>

        {props.networkWarning && (
          <NetworkWarning warning={props.networkWarning} />
        )}

        {/* Direct transfer badge */}
        <div className="flex items-center gap-2 p-3 rounded-xl bg-[var(--success)]/10 border border-[var(--success)]/20 mb-4">
          <Zap className="w-4 h-4 text-[var(--success)] flex-shrink-0" />
          <p className="text-xs font-medium text-[var(--success)]">
            Tips are forwarded directly to the creator's wallet — no withdrawal needed
          </p>
        </div>

        {/* Recipient address */}
        <div className="flex items-center gap-3 p-3 rounded-xl bg-[var(--accent-glow)] mb-5">
          <span className="flex-shrink-0 w-8 h-8 rounded-lg bg-[var(--accent)] flex items-center justify-center">
            <User className="w-4 h-4 text-white" />
          </span>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-semibold text-[var(--accent)]">
              Tips go directly to
            </p>
            <p className="text-xs font-mono text-[var(--text)] truncate">
              {props.recipientAddress
                ? props.recipientAddress
                : '0xD53aC13c75038545F8265c4AfAe41Bcb77c158c8'}
            </p>
          </div>
          {props.isRecipient && (
            <span className="flex-shrink-0 text-xs font-bold text-[var(--success)] bg-[var(--success)]/10 px-2 py-1 rounded-lg">
              You
            </span>
          )}
        </div>

        <div className="grid grid-cols-2 gap-3 mb-5">
          <div className="rounded-xl p-3 bg-[var(--bg)] border border-[var(--border)]">
            <div className="flex items-center gap-1.5 mb-1">
              <TrendingUp className="w-3.5 h-3.5 text-[var(--accent)]" />
              <span className="text-xs text-[var(--muted)] font-medium">
                Total Tips
              </span>
            </div>
            <span className="text-lg font-bold text-[var(--text)] tabular-nums">
              {props.tipCount}
            </span>
          </div>
          <div className="rounded-xl p-3 bg-[var(--bg)] border border-[var(--border)]">
            <div className="flex items-center gap-1.5 mb-1">
              <Zap className="w-3.5 h-3.5 text-[var(--accent)]" />
              <span className="text-xs text-[var(--muted)] font-medium">
                Volume Forwarded
              </span>
            </div>
            <span className="text-lg font-bold text-[var(--text)] tabular-nums">
              {parseFloat(props.totalVolume).toFixed(4)} 0G
            </span>
          </div>
        </div>

        <div className="rounded-xl border border-[var(--border)] p-4 mb-4">
          <label className="text-xs font-semibold text-[var(--text)] mb-2 block">
            Tip Amount (0G)
          </label>
          <div className="flex gap-2 mb-3">
            {['0.1', '0.5', '1'].map((amt) => (
              <button
                key={amt}
                onClick={() => setTipAmount(amt)}
                className={`flex-1 py-2 rounded-lg text-xs font-semibold transition-all ${
                  tipAmount === amt
                    ? 'bg-[var(--accent)] text-white'
                    : 'bg-[var(--bg)] text-[var(--muted)] hover:text-[var(--accent)] border border-[var(--border)]'
                }`}
              >
                {amt}
              </button>
            ))}
          </div>
          <input
            type="number"
            step="0.01"
            min="0"
            value={tipAmount}
            onChange={(e) => setTipAmount(e.target.value)}
            className="w-full px-3 py-2 rounded-lg bg-[var(--bg)] border border-[var(--border)] text-sm font-medium text-[var(--text)] outline-none focus:border-[var(--accent)] transition-colors mb-3"
            placeholder="Custom amount"
          />
          <label className="text-xs font-semibold text-[var(--text)] mb-2 block">
            Message (optional)
          </label>
          <input
            type="text"
            value={tipMessage}
            onChange={(e) => setTipMessage(e.target.value)}
            maxLength={100}
            className="w-full px-3 py-2 rounded-lg bg-[var(--bg)] border border-[var(--border)] text-sm text-[var(--text)] outline-none focus:border-[var(--accent)] transition-colors mb-3"
            placeholder="Obrigado pelo conselho!"
          />
          <button
            onClick={handleSendTip}
            disabled={props.isSendingTip || !tipAmount}
            className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg bg-[var(--accent)] text-white font-semibold text-sm hover:scale-[1.02] hover:bg-[var(--accent-soft)] active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_4px_16px_var(--accent-glow)]"
          >
            {props.isSendingTip ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                Sending…
              </>
            ) : (
              <>
                <ArrowUpRight className="w-4 h-4" />
                Send {tipAmount} 0G Tip
              </>
            )}
          </button>
          {props.tipError && (
            <div className="flex items-center gap-2 mt-3 p-2.5 rounded-lg bg-[var(--error)]/10 border border-[var(--error)]/20">
              <AlertCircle className="w-3.5 h-3.5 text-[var(--error)] flex-shrink-0" />
              <p className="text-xs text-[var(--error)]">{props.tipError}</p>
            </div>
          )}
          {props.lastTxHash && !props.isSendingTip && (
            <div className="flex items-center gap-2 mt-3 p-2.5 rounded-lg bg-[var(--success)]/10 border border-[var(--success)]/20">
              <Check className="w-3.5 h-3.5 text-[var(--success)] flex-shrink-0" />
              <p className="text-xs text-[var(--success)] font-medium">
                Sent: {shortenAddress(props.lastTxHash)}
              </p>
            </div>
          )}
        </div>

        <div className="mb-2">
          <p className="text-xs font-semibold text-[var(--text)] mb-2">
            Recent Tips
          </p>
          <TipsList tips={props.tips} />
        </div>

        {/* Safety net withdraw — only shows if somehow there's a stuck balance */}
        {props.isRecipient && parseFloat(props.contractBalance) > 0 && (
          <button
            onClick={props.withdraw}
            disabled={props.isWithdrawing}
            className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl border border-[var(--accent)] text-[var(--accent)] font-semibold text-sm hover:bg-[var(--accent)] hover:text-white transition-all disabled:opacity-50 mt-4"
          >
            {props.isWithdrawing ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                Withdrawing…
              </>
            ) : (
              <>
                <Shield className="w-4 h-4" />
                Recover {parseFloat(props.contractBalance).toFixed(4)} 0G
              </>
            )}
          </button>
        )}

        <PremiumSection hasPremium={props.hasPremium} />
      </div>
    </section>
  );
}
