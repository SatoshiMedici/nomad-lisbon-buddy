import { useState, useRef, useEffect } from 'react';
import {
  Send,
  Sun,
  Home,
  Wallet,
  Globe,
  BarChart3,
  Search,
  Trash2,
  Copy,
  Check,
  MessageSquare,
  Activity,
} from 'lucide-react';
import { generateResponse } from './knowledge';
import { useWallet } from './hooks/useWallet';
import { useCryptoPrices } from './hooks/useCryptoPrices';
import { useTippingContract } from './hooks/useTippingContract';
import WalletButton from './components/WalletButton';
import CryptoCalculator from './components/CryptoCalculator';
import TippingPanel from './components/TippingPanel';

type Message = {
  id: number;
  role: 'user' | 'buddy';
  text: string;
  category?: string;
  paragraphs?: string[];
};

const suggestedPrompts = [
  {
    icon: Home,
    text: 'Which neighborhood is best for a remote worker on €2000/month?',
  },
  {
    icon: Wallet,
    text: 'How do I get a NIF and open a bank account?',
  },
  {
    icon: Globe,
    text: 'Where can I work from a café with fast WiFi in Príncipe Real?',
  },
  {
    icon: BarChart3,
    text: 'Is Lisbon expensive compared to other EU capitals?',
  },
  {
    icon: Search,
    text: "What's the easiest way to find housing for a short-term stay?",
  },
  {
    icon: Activity,
    text: 'Which cafés in Lisbon accept crypto payments?',
  },
];

function TileMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 40 40"
      className={className}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <rect x="2" y="2" width="36" height="36" rx="8" fill="var(--accent)" />
      <path d="M20 7 L29 20 L20 33 L11 20 Z" fill="var(--yellow)" />
      <circle cx="20" cy="20" r="3.2" fill="var(--surface)" />
      <path
        d="M20 2 V11 M20 29 V38 M2 20 H11 M29 20 H38"
        stroke="var(--accent-soft)"
        strokeWidth="1.4"
        strokeLinecap="round"
      />
    </svg>
  );
}

function TypingIndicator() {
  return (
    <div className="flex items-center gap-3 animate-fade-in-up">
      <div className="flex-shrink-0 w-10 h-10 rounded-full bg-[var(--yellow-soft)] border border-[var(--yellow-glow)] flex items-center justify-center">
        <Sun className="w-5 h-5 text-[var(--accent)]" />
      </div>
      <div className="glass rounded-2xl rounded-tl-sm px-5 py-4 flex items-center gap-1.5">
        <span
          className="w-2 h-2 rounded-full bg-[var(--accent)]"
          style={{ animation: 'bounce-dot 1.2s infinite ease-in-out' }}
        />
        <span
          className="w-2 h-2 rounded-full bg-[var(--accent)]"
          style={{ animation: 'bounce-dot 1.2s infinite ease-in-out 0.2s' }}
        />
        <span
          className="w-2 h-2 rounded-full bg-[var(--accent)]"
          style={{ animation: 'bounce-dot 1.2s infinite ease-in-out 0.4s' }}
        />
      </div>
    </div>
  );
}

export default function App() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isThinking, setIsThinking] = useState(false);
  const [copiedId, setCopiedId] = useState<number | null>(null);
  const threadRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const {
    address,
    isConnected,
    connect,
    disconnect,
    error: walletError,
    networkWarning,
  } = useWallet();
  const { prices, loading: pricesLoading, lastUpdated } = useCryptoPrices();
  const tipping = useTippingContract(isConnected, address);

  useEffect(() => {
    if (threadRef.current) {
      threadRef.current.scrollTo({
        top: threadRef.current.scrollHeight,
        behavior: 'smooth',
      });
    }
  }, [messages, isThinking]);

  const ask = (question: string) => {
    const trimmed = question.trim();
    if (!trimmed || isThinking) return;
    const userMsg: Message = {
      id: Date.now(),
      role: 'user',
      text: trimmed,
    };
    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
    setIsThinking(true);
    setTimeout(() => {
      const response = generateResponse(trimmed);
      const buddyMsg: Message = {
        id: Date.now() + 1,
        role: 'buddy',
        text: response.paragraphs.join('\n\n'),
        category: response.category,
        paragraphs: response.paragraphs,
      };
      setMessages((prev) => [...prev, buddyMsg]);
      setIsThinking(false);
    }, 900 + Math.random() * 700);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    ask(input);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      ask(input);
    }
  };

  const handlePromptClick = (text: string) => {
    ask(text);
  };

  const handleClear = () => {
    setMessages([]);
    setCopiedId(null);
  };

  const handleCopy = (id: number, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
    const el = e.target;
    el.style.height = 'auto';
    el.style.height = Math.min(el.scrollHeight, 160) + 'px';
  };

  return (
    <div className="min-h-screen tile-bg text-[var(--text)] flex flex-col">
      <header className="sticky top-0 z-50 backdrop-blur-md bg-[rgba(247,246,244,0.82)] border-b border-[var(--border)]">
        <div className="max-w-4xl mx-auto px-5 sm:px-6 py-4 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <TileMark className="w-9 h-9" />
            <div>
              <h1 className="text-lg font-bold tracking-tight leading-none">
                Nomad Lisbon Buddy
              </h1>
              <p className="text-xs text-[var(--muted)] mt-0.5">
                Your friendly local guide
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <WalletButton
              isConnected={isConnected}
              address={address}
              onConnect={connect}
              onDisconnect={disconnect}
              error={walletError}
            />
            {messages.length > 0 && (
              <button
                onClick={handleClear}
                className="flex items-center gap-1.5 text-xs font-medium text-[var(--muted)] hover:text-[var(--accent)] px-3 py-2 rounded-xl hover:bg-[var(--accent-glow)] transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Clear</span>
              </button>
            )}
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-4xl w-full mx-auto px-5 sm:px-6 py-8 flex flex-col">
        <section className="mb-8 animate-fade-in-up">
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0 w-14 h-14 rounded-2xl bg-[var(--yellow-soft)] border border-[var(--yellow-glow)] flex items-center justify-center shadow-[0_4px_20px_var(--yellow-glow)]">
              <Sun className="w-7 h-7 text-[var(--accent)]" />
            </div>
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight leading-tight">
                Olá! I'm your Lisbon Buddy.
              </h2>
              <p className="text-[var(--muted)] mt-2 text-base leading-relaxed max-w-2xl">
                Ask me anything about moving to and living in Lisbon —
                neighborhoods, visas, the NIF, banking, cafés with WiFi,
                transport, healthcare, housing, cost of living, and the local
                crypto and Web3 scene. I'll answer like a knowledgeable local
                friend over coffee.
              </p>
            </div>
          </div>
        </section>

        <section className="mb-6">
          <div className="flex items-center gap-2 mb-3">
            <MessageSquare className="w-4 h-4 text-[var(--accent)]" />
            <p className="text-sm font-semibold text-[var(--muted)]">
              Try one of these to start
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {suggestedPrompts.map((prompt, i) => {
              const Icon = prompt.icon;
              return (
                <button
                  key={i}
                  onClick={() => handlePromptClick(prompt.text)}
                  disabled={isThinking}
                  className="group glass rounded-2xl p-4 text-left flex items-start gap-3 hover:scale-[1.02] hover:border-[var(--accent)] hover:shadow-[0_8px_28px_var(--accent-glow)] transition-all duration-200 animate-fade-in-up disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                  style={{ animationDelay: `${i * 0.08}s` }}
                >
                  <span className="flex-shrink-0 w-9 h-9 rounded-xl bg-[var(--accent-glow)] flex items-center justify-center group-hover:bg-[var(--accent)] transition-colors">
                    <Icon
                      className="text-[var(--accent)] group-hover:text-white transition-colors"
                      style={{ width: 18, height: 18 }}
                    />
                  </span>
                  <span className="text-sm font-medium leading-snug pt-1">
                    {prompt.text}
                  </span>
                </button>
              );
            })}
          </div>
        </section>

        <CryptoCalculator
          prices={prices}
          loading={pricesLoading}
          lastUpdated={lastUpdated}
          walletAddress={address}
          isConnected={isConnected}
        />

        <TippingPanel
          isConnected={isConnected}
          contractAddress={tipping.contractAddress}
          isDeploying={tipping.isDeploying}
          deployError={tipping.deployError}
          deploy={tipping.deploy}
          tipCount={tipping.tipCount}
          tips={tipping.tips}
          hasPremium={tipping.hasPremium}
          isSendingTip={tipping.isSendingTip}
          tipError={tipping.tipError}
          lastTxHash={tipping.lastTxHash}
          sendTip={tipping.sendTip}
          withdraw={tipping.withdraw}
          isWithdrawing={tipping.isWithdrawing}
          isRecipient={tipping.isRecipient}
          recipientAddress={tipping.recipientAddress}
          contractBalance={tipping.contractBalance}
          totalVolume={tipping.totalVolume}
          networkWarning={networkWarning}
        />

        <section
          ref={threadRef}
          className="flex-1 space-y-5 mb-6 min-h-[120px] mt-6"
        >
          {messages.length === 0 && !isThinking && (
            <div
              className="glass rounded-2xl p-6 text-center animate-fade-in-up"
              style={{ animationDelay: '0.3s' }}
            >
              <p className="text-[var(--muted)] text-sm">
                Your conversation will appear here. Ask a question above or tap
                a suggestion to get started.
              </p>
            </div>
          )}

          {messages.map((msg) =>
            msg.role === 'user' ? (
              <div
                key={msg.id}
                className="flex justify-end animate-fade-in-up"
              >
                <div className="max-w-[85%] bg-[var(--yellow-soft)] border border-[var(--yellow-glow)] rounded-2xl rounded-tr-sm px-5 py-3.5 shadow-[0_2px_12px_rgba(244,201,93,0.18)]">
                  <p className="text-sm font-medium leading-relaxed text-[var(--text)] whitespace-pre-wrap">
                    {msg.text}
                  </p>
                </div>
              </div>
            ) : (
              <div
                key={msg.id}
                className="flex items-start gap-3 animate-fade-in-up"
              >
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-[var(--yellow-soft)] border border-[var(--yellow-glow)] flex items-center justify-center">
                  <Sun className="w-5 h-5 text-[var(--accent)]" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="glass rounded-2xl rounded-tl-sm px-5 py-4 shadow-[0_2px_12px_rgba(0,0,0,0.04)]">
                    <div className="flex items-center justify-between mb-3">
                      <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-[var(--accent)] bg-[var(--accent-glow)] px-2.5 py-1 rounded-full">
                        <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent)]" />
                        {msg.category}
                      </span>
                      <button
                        onClick={() => handleCopy(msg.id, msg.text)}
                        className="flex items-center gap-1 text-xs text-[var(--muted)] hover:text-[var(--accent)] transition-colors px-2 py-1 rounded-lg hover:bg-[var(--accent-glow)]"
                        aria-label="Copy response"
                      >
                        {copiedId === msg.id ? (
                          <>
                            <Check className="w-3.5 h-3.5" />
                            <span>Copied</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3.5 h-3.5" />
                            <span>Copy</span>
                          </>
                        )}
                      </button>
                    </div>
                    <div className="space-y-3">
                      {msg.paragraphs?.map((para, i) => (
                        <p
                          key={i}
                          className="text-sm leading-relaxed text-[var(--text)]"
                        >
                          {para}
                        </p>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )
          )}

          {isThinking && <TypingIndicator />}
        </section>

        <form
          onSubmit={handleSubmit}
          className="sticky bottom-0 -mx-5 sm:-mx-6 px-5 sm:px-6 pb-5 pt-3 bg-gradient-to-t from-[var(--bg)] via-[var(--bg)] to-transparent"
        >
          <div className="glass rounded-2xl p-2 flex items-end gap-2 shadow-[0_8px_32px_rgba(0,0,0,0.08)] focus-within:border-[var(--accent)] focus-within:shadow-[0_8px_32px_var(--accent-glow)] transition-all">
            <textarea
              ref={textareaRef}
              value={input}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              placeholder="Ask your Lisbon question…"
              rows={1}
              className="flex-1 bg-transparent resize-none outline-none px-3 py-2.5 text-sm leading-relaxed text-[var(--text)] placeholder:text-[var(--muted)] max-h-40"
            />
            <button
              type="submit"
              disabled={!input.trim() || isThinking}
              className="flex-shrink-0 w-11 h-11 rounded-xl bg-[var(--accent)] text-white flex items-center justify-center hover:scale-105 hover:bg-[var(--accent-soft)] active:scale-95 transition-all disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:scale-100 shadow-[0_4px_16px_var(--accent-glow)]"
              aria-label="Send question"
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
          <p className="text-xs text-[var(--muted)] mt-2 text-center">
            Friendly guidance, not official advice — verify legal and financial
            details with the relevant authorities.
          </p>
        </form>
      </main>
    </div>
  );
}
