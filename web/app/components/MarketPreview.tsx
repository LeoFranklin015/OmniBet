import Link from "next/link";
import { Clock, Check, X } from "lucide-react";

export interface Market {
  id: string | number;
  question: string;
  endTime: string | number; // timestamp in seconds
  resolved: boolean;
  result: boolean | null;
  totalYes: string | number; // in Wei format
  totalNo: string | number; // in Wei format
  totalPriceToken: string | number; // in Wei format
  creator: string;
  marketId: string | number;
  liquidityInitialized: boolean;
  claimers: string[];
  createdAt: string | number; // timestamp in seconds
  updatedAt: string | number; // timestamp in seconds
}

interface MarketPreviewProps {
  market: Market;
}

export default function MarketPreview({ market }: MarketPreviewProps) {
  // Convert endTime from seconds to milliseconds
  const endTimeMs = Number(market.endTime) * 1000;
  const timeLeft = endTimeMs - Date.now();
  const isEnded = timeLeft <= 0;

  // Calculate totalStaked as the sum of totalYes and totalNo
  const totalYesNum = Number(ethToNumber(market.totalYes.toString()));
  const totalNoNum = Number(ethToNumber(market.totalNo.toString()));
  const totalStaked = Number(ethToNumber(market.totalPriceToken.toString()));

  // Calculate YES probability
  const yesPercentage =
    totalYesNum + totalNoNum > 0
      ? Math.round((totalYesNum / (totalYesNum + totalNoNum)) * 100)
      : 50; // Default to 50% if no stakes

  // Using LMSR to calculate cost of buying 1 token
  const liquidityParameter = 1000; // As specified
  const costToAddOneYes = getLMSRCost(
    totalYesNum,
    totalNoNum,
    true,
    1,
    liquidityParameter
  );
  const costToAddOneNo = getLMSRCost(
    totalYesNum,
    totalNoNum,
    false,
    1,
    liquidityParameter
  );

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

  return (
    <Link href={`/markets/${market.id}`}>
      <div className="p-6 bg-gray-800 rounded-lg pixelated-border hover:bg-gray-700 transition-colors">
        <div className="flex justify-between mb-4">
          <h3 className="text-lg font-pixel mb-4">{market.question}</h3>
          <div className="flex items-center text-3xl font-mono">
            {market.resolved ? (
              <span className="flex items-center">
                {market.result ? (
                  <Check className="w-4 h-4 mr-1 text-green-400" />
                ) : (
                  <X className="w-4 h-4 mr-1 text-red-400" />
                )}
                Resolved
              </span>
            ) : (
              <span className="flex items-center">
                <Clock className="w-4 h-4 mr-1" />
                {formatTimeLeft()}
              </span>
            )}
          </div>
        </div>

        <div className="mb-4">
          <div className="flex justify-between text-3xl font-mono mb-1">
            <span>YES {yesPercentage}%</span>
            <span>NO {100 - yesPercentage}%</span>
          </div>
          <div className="w-full h-4 bg-gray-700 rounded overflow-hidden">
            <div
              className="h-full bg-green-400"
              style={{ width: `${yesPercentage}%` }}
            ></div>
          </div>
        </div>

        <div className="flex justify-between text-xl font-mono mb-2">
          <span>Total Staked: {formatNumber(totalStaked)} USDC</span>
        </div>

        {/* LMSR Cost Display */}
        <div className="mt-2 p-2 rounded">
          <div className="text-md font-mono text-center mb-1">
            Current Token Prices:
          </div>
          <div className="flex justify-between text-xl font-mono">
            <div className="flex items-center">
              <div className="w-3 h-3 bg-green-400 rounded-full mr-1"></div>
              <span>YES: {formatNumber(costToAddOneYes)} USDC</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 bg-red-400 rounded-full mr-1"></div>
              <span>NO: {formatNumber(costToAddOneNo)} USDC</span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}

// LMSR Cost calculation function (JavaScript implementation of the Solidity contract)
function getLMSRCost(
  qYes: number,
  qNo: number,
  isYesToken: boolean,
  amount: number,
  liquidityParameter: number
): number {
  if (amount <= 0) return 0;

  // Current total cost
  const totalCost =
    liquidityParameter *
    Math.log(
      Math.exp(qYes / liquidityParameter) + Math.exp(qNo / liquidityParameter)
    );

  // New cost after adding the tokens
  let newCost;
  if (isYesToken) {
    newCost =
      liquidityParameter *
      Math.log(
        Math.exp((qYes + amount) / liquidityParameter) +
          Math.exp(qNo / liquidityParameter)
      );
  } else {
    newCost =
      liquidityParameter *
      Math.log(
        Math.exp(qYes / liquidityParameter) +
          Math.exp((qNo + amount) / liquidityParameter)
      );
  }

  // Price is the difference between new and current costs
  return newCost - totalCost;
}

// Convert Wei to ETH (or just to a more usable number format)
function ethToNumber(weiValue: string): number {
  return parseInt(weiValue) / 1e18;
}

function formatNumber(num: number): string {
  if (num >= 1000000) {
    return `${(num / 1000000).toFixed(1)}M`;
  } else if (num >= 1000) {
    return `${(num / 1000).toFixed(1)}K`;
  } else {
    return num.toFixed(5);
  }
}
