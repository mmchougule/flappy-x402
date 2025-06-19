import { useState, useCallback, useEffect } from "react";
import { gameAPI, updateApiClientWithWallet } from "../services/x402Client";
import type { GameSession, PaymentStatus } from "../services/x402Client";
import { useDynamicContext } from "@dynamic-labs/sdk-react-core";
// import { useWallet } from "../contexts/WalletContext";

interface UseGameSessionReturn {
  session: GameSession | null;
  paymentStatus: PaymentStatus;
  error: string | null;
  isLoading: boolean;
  hasActiveGame: boolean;
  createSession: () => Promise<void>;
  continueGame: (score: number) => Promise<number | null>;
  submitScore: (score: number) => Promise<void>;
  resetSession: () => void;
}

export function useGameSession(): UseGameSessionReturn {
  const [session, setSession] = useState<GameSession | null>(null);
  const [paymentStatus, setPaymentStatus] = useState<PaymentStatus>("idle");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [hasActiveGame, setHasActiveGame] = useState(false);
  
  // const { isConnected, walletClient } = useWallet();
  const { primaryWallet } = useDynamicContext();

  // Update API client when wallet connection changes
  useEffect(() => {
    updateApiClientWithWallet(primaryWallet);
  }, [primaryWallet]);

  const createSession = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      setPaymentStatus("processing");

      // Check if wallet is connected
      if (!primaryWallet) {
        throw new Error("Please connect your wallet to play");
      }

      // Ensure API client has the latest wallet
      updateApiClientWithWallet(primaryWallet);

      const newSession = await gameAPI.createSession();
      
      setSession(newSession);
      setPaymentStatus("success");
      setHasActiveGame(true);
    } catch (err: any) {
      setPaymentStatus("error");
      
      // Better error messages
      if (err.code === 'ERR_NETWORK' || err.message?.includes('Network Error')) {
        setError("Cannot connect to server. Please ensure the server is running on port 3001.");
      } else if (err.response?.status === 402) {
        setError("Payment required. Please ensure you have USDC on Base Sepolia.");
      } else if (err.response?.status === 500) {
        setError("Server error. Please check server logs.");
      } else if (err.message?.includes('Please connect your wallet')) {
        setError(err.message);
      } else if (err.message?.includes('Payment authorization was rejected')) {
        setError(err.message);
      } else if (err.response?.data?.error) {
        setError(err.response.data.error);
      } else if (err.message) {
        setError(err.message);
      } else {
        setError("Failed to create game session. Please check console for details.");
      }
      
      console.error("Session creation error:", err);
    } finally {
      setIsLoading(false);
    }
  }, [primaryWallet]);

  const continueGame = useCallback(async (score: number): Promise<number | null> => {
    try {
      setIsLoading(true);
      setError(null);
      setPaymentStatus("processing");

      // Check if wallet is connected
      if (!primaryWallet) {
        throw new Error("Please connect your wallet to continue");
      }

      // Ensure API client has the latest wallet
      updateApiClientWithWallet(primaryWallet);

      const response = await gameAPI.continueGame(score);
      
      setSession({
        sessionId: response.sessionId,
        message: response.message,
      });
      setPaymentStatus("success");
      setHasActiveGame(true);
      
      // Return the continue score
      return response.continueScore || score;
    } catch (err: any) {
      setPaymentStatus("error");
      
      // Better error messages
      if (err.code === 'ERR_NETWORK' || err.message?.includes('Network Error')) {
        setError("Cannot connect to server. Please ensure the server is running on port 3001.");
      } else if (err.response?.status === 402) {
        setError("Payment required. Please ensure you have $1 USDC on Base Sepolia for pay-to-win.");
      } else if (err.message?.includes('Please connect your wallet')) {
        setError(err.message);
      } else if (err.message?.includes('pay-to-win payment was rejected')) {
        setError(err.message);
      } else if (err.response?.data?.error) {
        setError(err.response.data.error);
      } else if (err.message) {
        setError(err.message);
      } else {
        setError("Failed to continue game. Please check console for details.");
      }
      
      console.error("Continue game error:", err);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [primaryWallet]);

  const submitScore = useCallback(async (score: number) => {
    if (!session) {
      console.error("No active session when submitting score");
      return;
    }

    if (!hasActiveGame) {
      console.error("Game already ended, cannot submit score again");
      return;
    }

    try {
      await gameAPI.submitScore(session.sessionId, score);
      console.log(`Score ${score} submitted for session ${session.sessionId}`);
      
      // Mark game as ended
      setHasActiveGame(false);
      
      // Clear payment status to prevent re-triggering game start
      setPaymentStatus("idle");
      
    } catch (err: any) {
      console.error("Failed to submit score:", err);
      // Still mark as not active even if submission fails
      setHasActiveGame(false);
      setPaymentStatus("idle");
    }
  }, [session, hasActiveGame]);

  const resetSession = useCallback(() => {
    setSession(null);
    setPaymentStatus("idle");
    setHasActiveGame(false);
    setError(null);
  }, []);

  return {
    session,
    paymentStatus,
    error,
    isLoading,
    hasActiveGame,
    createSession,
    continueGame,
    submitScore,
    resetSession,
  };
} 