import { client } from "@/lib/client";
import React, { useEffect, useState, useCallback } from "react";
import { erc20Abi } from "viem";

const USDCBalance = ({
  usdcAddress,
  address,
}: {
  usdcAddress: string;
  address: string;
}) => {
  const [balance, setBalance] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchBalance = useCallback(
    async (retryCount = 0, delay = 1000) => {
      if (!address || !usdcAddress) return;

      if (retryCount === 0) {
        setIsLoading(true);
        setError(null);
      }

      try {
        const balance = await client.readContract({
          address: usdcAddress as `0x${string}`,
          abi: erc20Abi,
          functionName: "balanceOf",
          args: [address as `0x${string}`],
        });
        setBalance(Number(balance) / 10 ** 18);
        setIsLoading(false);
      } catch (error) {
        console.error(
          `Error fetching balance (attempt ${retryCount + 1}):`,
          error
        );

        // Check if it's a timeout or rate limit error
        const errorMessage = String(error);
        if (
          (errorMessage.includes("timeout") ||
            errorMessage.includes("rate limit") ||
            errorMessage.includes("free tier")) &&
          retryCount < 3
        ) {
          // Exponential backoff with jitter
          const nextDelay = delay * 1.5 + Math.random() * 1000;
          setError(
            `RPC rate limited. Retrying in ${Math.round(nextDelay / 1000)}s...`
          );

          setTimeout(() => {
            fetchBalance(retryCount + 1, nextDelay);
          }, nextDelay);
        } else {
          setError("Failed to load balance. Please try again later.");
          setIsLoading(false);
        }
      }
    },
    [usdcAddress, address]
  );

  useEffect(() => {
    fetchBalance();

    // Set up a refresh interval (every 30 seconds)
    const intervalId = setInterval(() => {
      fetchBalance();
    }, 30000);

    return () => clearInterval(intervalId);
  }, [fetchBalance]);

  return (
    <div>
      {isLoading ? (
        <h3 className="flex items-center gap-3 px-2 py-2 rounded pixelated-border text-yellow-500 text-lg">
          <span className="w-3 h-3 border-2 border-t-transparent border-yellow-500 rounded-full animate-spin mr-1"></span>
          Loading...
        </h3>
      ) : error ? (
        <h3 className="flex items-center gap-3 px-2 py-2 rounded pixelated-border text-red-400 text-lg">
          {error.includes("Retrying") ? error : "Error loading balance"}
        </h3>
      ) : (
        <h3 className="flex items-center gap-3 px-2 py-2 hover:text-black rounded pixelated-border hover:bg-yellow-500 transition-colors text-green-500 text-lg">
          {balance} USDC
        </h3>
      )}
    </div>
  );
};

export default USDCBalance;
