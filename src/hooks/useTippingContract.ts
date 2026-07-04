import { useState, useCallback } from 'react';

export const RECIPIENT_ADDRESS = '0xD53aC13c75038545F8265c4AfAe41Bcb77c158c8';

type Eip1193Provider = {
  request: (args: { method: string; params?: unknown[] }) => Promise<unknown>;
};

declare global {
  interface Window {
    ethereum?: Eip1193Provider;
  }
}

function toHexWei(amountEth: string): string {
  const trimmed = amountEth.trim();
  if (!trimmed || isNaN(Number(trimmed))) return '0x0';
  const [whole = '0', frac = ''] = trimmed.split('.');
  const fracPadded = (frac + '000000000000000000').slice(0, 18);
  const weiStr = (whole + fracPadded).replace(/^0+/, '') || '0';
  return '0x' + BigInt(weiStr).toString(16);
}

export type TipStatus = 'idle' | 'sending' | 'success' | 'error';

export function useTippingContract(senderAddress: string | null) {
  const [status, setStatus] = useState<TipStatus>('idle');
  const [txHash, setTxHash] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const sendTip = useCallback(
    async (amountEth: string) => {
      const provider = window.ethereum;
      if (!provider) {
        setError('No wallet found. Install MetaMask to send tips.');
        setStatus('error');
        return;
      }
      if (!senderAddress) {
        setError('Connect your wallet first.');
        setStatus('error');
        return;
      }
      const value = Number(amountEth);
      if (!value || value <= 0) {
        setError('Enter a valid tip amount.');
        setStatus('error');
        return;
      }

      setStatus('sending');
      setError(null);
      setTxHash(null);

      try {
        const hash = (await provider.request({
          method: 'eth_sendTransaction',
          params: [
            {
              from: senderAddress,
              to: RECIPIENT_ADDRESS,
              value: toHexWei(amountEth),
            },
          ],
        })) as string;
        setTxHash(hash);
        setStatus('success');
      } catch (err) {
        const msg =
          err instanceof Error ? err.message : 'Tip failed to send. Please try again.';
        setError(msg);
        setStatus('error');
      }
    },
    [senderAddress]
  );

  const reset = useCallback(() => {
    setStatus('idle');
    setTxHash(null);
    setError(null);
  }, []);

  return {
    recipientAddress: RECIPIENT_ADDRESS,
    sendTip,
    status,
    isSending: status === 'sending',
    txHash,
    error,
    reset,
  };
}
