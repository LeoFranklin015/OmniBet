import Link from "next/link";
import { Clock, Check, X } from "lucide-react";

export interface Market {
  id: string;
  question: string;
  endTime: string; // timestamp in seconds
  resolved: boolean;
  result: boolean;
  totalYes: string; // in Wei format
  totalNo: string; // in Wei format
  totalPriceToken: string; // in Wei format
  creator: string;
  marketId: string;
  liquidityInitialized: boolean;
  claimers: string[];
  createdAt: string; // timestamp in seconds
  updatedAt: string; // timestamp in seconds
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
  const totalYesNum = Number(ethToNumber(market.totalYes));
  const totalNoNum = Number(ethToNumber(market.totalNo));
  const totalStaked = totalYesNum + totalNoNum;

  // Calculate YES probability
  const yesPercentage =
    totalStaked > 0 ? Math.round((totalYesNum / totalStaked) * 100) : 50; // Default to 50% if no stakes

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
          <div className="flex justify-between text-xs font-mono mb-1">
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

        <div className="flex justify-between text-sm font-mono">
          <span>Total Staked: {formatNumber(totalStaked)}</span>
          <span>
            Liquidity: {formatNumber(ethToNumber(market.totalPriceToken))}
          </span>
        </div>
      </div>
    </Link>
  );
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
    return num.toFixed(2);
  }
}
