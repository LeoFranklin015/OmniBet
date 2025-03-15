"use client";

import { useState } from "react";
import Link from "next/link";
import { Clock, Check, X, Award, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { client, walletClient } from "@/lib/client";
import {
  PredictionMarketAddressSepoliaA,
  PredictionMarketAddressSepoliaA_ABI,
} from "@/lib/const";
import { useAccount } from "wagmi";

interface UserMarket {
  id: string;
  question: string;
  endTime: Date;
  betAmount: number;
  yesBetAmount: number;
  noBetAmount: number;
  yesInMarket: number;
  noInMarket: number;
  rewards: number;
  resolved: boolean;
  won: boolean | null;
  claimed: boolean;
  totalYes: number;
  totalNo: number;
  createdAt: Date;
  updatedAt: Date;
}

interface UserMarketCardProps {
  market: UserMarket;
}

export default function UserMarketCard({ market }: UserMarketCardProps) {
  const [isClaiming, setIsClaiming] = useState(false);
  const { address } = useAccount();
  const timeLeft = market.endTime.getTime() - Date.now();
  const isEnded = timeLeft <= 0;

  // Format time left
  const formatTimeLeft = () => {
    if (isEnded) return "Ended";

    const days = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
    const hours = Math.floor(
      (timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
    );

    if (days > 0) {
      return `${days}d ${hours}h left`;
    } else {
      const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
      return `${hours}h ${minutes}m left`;
    }
  };

  // Calculate odds and potential winnings based on market data
  const calculateOdds = (position: "YES" | "NO") => {
    const totalLiquidity = market.totalYes + market.totalNo;
    if (totalLiquidity === 0) return "1.0x";

    if (position === "YES") {
      return (totalLiquidity / market.totalYes || 1).toFixed(1) + "x";
    } else {
      return (totalLiquidity / market.totalNo || 1).toFixed(1) + "x";
    }
  };

  const handleClaim = async () => {
    setIsClaiming(true);

    const tx = await walletClient.writeContract({
      address: PredictionMarketAddressSepoliaA,
      abi: PredictionMarketAddressSepoliaA_ABI,
      functionName: "claimReward",
      args: [market.id],
      account: address as `0x${string}`,
    });

    await client.waitForTransactionReceipt({ hash: tx });

    setIsClaiming(false);
  };

  // Determine primary position (YES if more YES tokens, NO if more NO tokens)
  const primaryPosition =
    market.yesInMarket >= market.noInMarket ? "YES" : "NO";
  const primaryAmount =
    primaryPosition === "YES" ? market.yesInMarket : market.noInMarket;
  const odds = calculateOdds(primaryPosition);

  return (
    <div className="bg-gray-800 rounded-lg pixelated-border p-6">
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center text-2xl font-mono">
          {market.resolved ? (
            <span className="flex items-center">
              {market.won ? (
                <Check className="w-4 h-4 mr-1 text-green-400" />
              ) : (
                <X className="w-4 h-4 mr-1 text-red-400" />
              )}
              {market.won ? "Won" : "Lost"}
            </span>
          ) : (
            <span className="flex items-center">
              <Clock className="w-4 h-4 mr-1" />
              {formatTimeLeft()}
            </span>
          )}
        </div>
      </div>

      <Link href={`/markets/${market.id}`}>
        <h3 className="text-lg font-pixel mb-4 hover:text-green-300 transition-colors">
          {market.question}
        </h3>
      </Link>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div className="bg-gray-700 p-3 rounded-lg">
          <div className="flex justify-between items-center">
            <div>
              <div className="text-lg font-mono opacity-70">Your Positions</div>
              <div className="text-lg font-pixel flex items-center gap-8">
                <span className="text-green-400">{market.yesInMarket} YES</span>
                {market.noInMarket > 0 && (
                  <span className="text-red-400 ml-2">
                    {market.noInMarket} NO
                  </span>
                )}
              </div>
            </div>
            <div>
              <div className="text-lg font-mono opacity-70">Total Spent</div>
              <div className="text-lg font-pixel">
                {market.betAmount.toFixed(3)} USDC
              </div>
            </div>
          </div>
        </div>

        <div className="bg-gray-700 p-3 rounded-lg">
          <div className="flex justify-between items-center">
            <div>
              <div className="text-lg font-mono opacity-70">Current Odds</div>
              <div className="text-lg font-pixel">{odds}</div>
            </div>
            <div>
              <div className="text-lg font-mono opacity-70">
                {market.resolved ? "Rewards" : "Potential Rewards"}
              </div>
              <div className="text-lg font-pixel">
                {market.rewards > 0 ? market.rewards.toFixed(3) : "TBD"} ETH
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-between items-center">
        <Link
          href={`/markets/${market.id}`}
          className="font-mono text-xl hover:text-green-300 transition-colors flex items-center"
        >
          View Market <ArrowRight className="ml-1 w-3 h-3" />
        </Link>

        {market.resolved && market.won && !market.claimed && (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  onClick={handleClaim}
                  disabled={isClaiming}
                  className=" bg-green-600 hover:bg-green-500 text-black"
                >
                  {isClaiming ? (
                    <span className="flex items-center">
                      <span className="w-4 h-4 border-2 border-t-transparent border-black rounded-full animate-spin mr-2"></span>
                      Claiming...
                    </span>
                  ) : (
                    <span className="flex items-center">
                      <Award className="w-4 h-4 mr-2" />
                      Claim {market.rewards.toFixed(3)} USDC
                    </span>
                  )}
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p className="font-mono text-xl">
                  Claim your winnings from this market
                </p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}

        {market.resolved && market.won && market.claimed && (
          <span className="font-mono text-xl text-green-400 flex items-center">
            <Check className="w-6 h-6 mr-1" />
            Claimed
          </span>
        )}
      </div>
    </div>
  );
}
