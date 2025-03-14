import Link from "next/link";
import { Clock, Check, X } from "lucide-react";
import type { Market } from "../data/markets";

interface MarketPreviewProps {
  market: Market;
}

export default function MarketPreview({ market }: MarketPreviewProps) {
  const timeLeft = market.endTime - Date.now();
  const isEnded = timeLeft <= 0;

  // Calculate YES probability based on LMSR
  const yesPercentage = Math.round(
    (market.totalYes / market.totalStaked) * 100
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
      <div className="p-6 bg-gray-800 rounded-lg pixelated-border hover:bg-gray-700 transition-colors ">
        <div className="flex justify-between items-start mb-4">
          <div className="flex items-center">
            <div
              className={`w-6 h-6 ${getChainColor(
                market.chain
              )} flex items-center justify-center font-pixel text-black text-base mr-2`}
            >
              {market.chain?.substring(0, 1)}
            </div>
            <span className="inline-block px-2 py-1 bg-gray-700 text-green-400 text-base font-mono rounded">
              {market.category}
            </span>
          </div>

          <div className="flex items-center text-xs font-mono">
            {market.resolved ? (
              <span className="flex items-center">
                {market.won ? (
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

        <h3 className="text-lg font-pixel mb-4">{market.question}</h3>

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
          <span>Total Staked: {formatNumber(market.totalStaked)}</span>
          <span>Liquidity: {formatNumber(market.totalPriceToken)}</span>
        </div>
      </div>
    </Link>
  );
}

function formatNumber(num: number): string {
  if (num >= 1000000) {
    return `${(num / 1000000).toFixed(1)}M`;
  } else if (num >= 1000) {
    return `${(num / 1000).toFixed(1)}K`;
  } else {
    return num.toString();
  }
}

function getChainColor(chain?: string): string {
  switch (chain) {
    case "ETH":
      return "bg-blue-400";
    case "BTC":
      return "bg-orange-400";
    case "SOL":
      return "bg-purple-400";
    case "AVAX":
      return "bg-red-400";
    case "MATIC":
      return "bg-indigo-400";
    default:
      return "bg-gray-400";
  }
}
