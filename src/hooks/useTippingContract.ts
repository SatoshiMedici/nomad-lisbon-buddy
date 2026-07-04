import { useState, useEffect, useCallback } from 'react';
import { ethers } from 'ethers';
import contractArtifact from '../contracts/LisbonTipping.json';

const STORAGE_KEY = 'nlb_tipping_contract_address';

export type Tip = {
  sender: string;
  amount: string;
  message: string;
  timestamp: number;
};

type WindowWithEthereum = Window & { ethereum?: unknown };

function getProvider(): ethers.BrowserProvider | null {
  if (typeof window === 'undefined') return null;
  const eth = (window as WindowWithEthereum).ethereum;
  if (!eth) return null;
  return new ethers.BrowserProvider(eth as never);
}

async function getSigner(): Promise<ethers.JsonRpcSigner | null> {
  const provider = getProvider();
  if (!provider) return null;
  try {
    return await provider.getSigner();
  } catch {
    return null;
  }
}

export function useTippingContract(isConnected: boolean, address: string | null) {
  const [contractAddress, setContractAddress] = useState<string | null>(null);
  const [isDeploying, setIsDeploying] = useState(false);
  const [deployError, setDeployError] = useState<string | null>(null);
  const [tipCount, setTipCount] = useState(0);
  const [tips, setTips] = useState<Tip[]>([]);
  const [hasPremium, setHasPremium] = useState(false);
  const [isSendingTip, setIsSendingTip] = useState(false);
  const [tipError, setTipError] = useState<string | null>(null);
  const [lastTxHash, setLastTxHash] = useState<string | null>(null);
  const [isWithdrawing, setIsWithdrawing] = useState(false);
  const [isOwner, setIsOwner] = useState(false);
  const [contractBalance, setContractBalance] = useState('0');

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) setContractAddress(saved);
  }, []);

  const refreshData = useCallback(async () => {
    if (!contractAddress) return;
    const provider = getProvider();
    if (!provider) return;
    try {
      const contract = new ethers.Contract(
        contractAddress,
        contractArtifact.abi,
        provider
      );
      const count = await contract.getTipCount();
      setTipCount(Number(count));

      const total = Number(count);
      const start = Math.max(0, total - 10);
      const newTips: Tip[] = [];
      for (let i = total - 1; i >= start; i--) {
        const tip = await contract.getTip(i);
        newTips.push({
          sender: tip[0],
          amount: ethers.formatEther(tip[1]),
          message: tip[2],
          timestamp: Number(tip[3]),
        });
      }
      setTips(newTips);

      if (address) {
        const premium = await contract.hasPremiumAccess(address);
        setHasPremium(premium);
        const owner = await contract.owner();
        setIsOwner(owner.toLowerCase() === address.toLowerCase());
      }

      const balance = await provider.getBalance(contractAddress);
      setContractBalance(ethers.formatEther(balance));
    } catch {
      // contract may not exist on this network — ignore
    }
  }, [contractAddress, address]);

  useEffect(() => {
    refreshData();
    if (!contractAddress) return;
    const provider = getProvider();
    if (!provider) return;
    const contract = new ethers.Contract(
      contractAddress,
      contractArtifact.abi,
      provider
    );
    const onTip = () => refreshData();
    contract.on('TipSent', onTip);
    contract.on('Withdrawn', onTip);
    return () => {
      contract.removeAllListeners();
    };
  }, [refreshData, contractAddress]);

  const deploy = useCallback(async () => {
    const signer = await getSigner();
    if (!signer) {
      setDeployError('Wallet not connected');
      return;
    }
    setIsDeploying(true);
    setDeployError(null);
    try {
      const factory = new ethers.ContractFactory(
        contractArtifact.abi,
        contractArtifact.bytecode,
        signer
      );
      const contract = await factory.deploy();
      await contract.waitForDeployment();
      const addr = await contract.getAddress();
      setContractAddress(addr);
      localStorage.setItem(STORAGE_KEY, addr);
      refreshData();
    } catch (err) {
      setDeployError(err instanceof Error ? err.message : 'Deploy failed');
    } finally {
      setIsDeploying(false);
    }
  }, [refreshData]);

  const sendTip = useCallback(
    async (amountEth: string, message: string) => {
      const signer = await getSigner();
      if (!signer || !contractAddress) {
        setTipError('Wallet not connected or contract not deployed');
        return;
      }
      setIsSendingTip(true);
      setTipError(null);
      setLastTxHash(null);
      try {
        const contract = new ethers.Contract(
          contractAddress,
          contractArtifact.abi,
          signer
        );
        const tx = await contract.sendTip(message, {
          value: ethers.parseEther(amountEth),
        });
        setLastTxHash(tx.hash);
        await tx.wait();
        refreshData();
      } catch (err) {
        setTipError(err instanceof Error ? err.message : 'Tip failed');
      } finally {
        setIsSendingTip(false);
      }
    },
    [contractAddress, refreshData]
  );

  const withdraw = useCallback(async () => {
    const signer = await getSigner();
    if (!signer || !contractAddress) return;
    setIsWithdrawing(true);
    try {
      const contract = new ethers.Contract(
        contractAddress,
        contractArtifact.abi,
        signer
      );
      const tx = await contract.withdraw();
      await tx.wait();
      refreshData();
    } catch {
      // ignore
    } finally {
      setIsWithdrawing(false);
    }
  }, [contractAddress, refreshData]);

  return {
    contractAddress,
    isDeploying,
    deployError,
    deploy,
    tipCount,
    tips,
    hasPremium,
    isSendingTip,
    tipError,
    lastTxHash,
    sendTip,
    withdraw,
    isWithdrawing,
    isOwner,
    contractBalance,
  };
}
