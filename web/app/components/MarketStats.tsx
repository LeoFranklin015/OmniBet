import { BarChart, DollarSign, Users } from "lucide-react";
import type { Market } from "./MarketPreview";

interface MarketStatsProps {
  market: Market;
  className?: string;
}

// Helper function to convert Wei to ETH
function ethToNumber(weiValue: string): number {
  return parseInt(weiValue) / 1e18;
}

// Helper function to format numbers with commas and 2 decimal places
function formatNumber(num: number): string {
  if (num >= 1000000) {
    return `${(num / 1000000).toFixed(1)}M`;
  } else if (num >= 1000) {
    return `${(num / 1000).toFixed(1)}K`;
  } else {
    return num.toFixed(2);
  }
}

export default function MarketStats({
  market,
  className = "",
}: MarketStatsProps) {
  // Convert Wei values to numbers
  const totalYesNum = ethToNumber(market.totalYes.toString());
  const totalNoNum = ethToNumber(market.totalNo.toString());
  const totalStaked = ethToNumber(market.totalPriceToken.toString());

  // Calculate probabilities
  const yesPercentage = Math.round(
    (totalYesNum / (totalYesNum + totalNoNum)) * 100
  );
  const noPercentage = 100 - yesPercentage;

  return (
    <div className={`bg-gray-800 rounded-lg pixelated-border p-6 ${className}`}>
      <h3 className="text-2xl font-pixel mb-4">Market Statistics</h3>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-gray-700 p-4 rounded-lg">
          <div className="flex items-center mb-2">
            <BarChart className="w-4 h-4 mr-2 text-green-400" />
            <span className="font-mono text-lg">Total Staked</span>
          </div>
          <div className="font-mono text-2xl">
            {formatNumber(totalStaked)} USDC
          </div>
        </div>

        <div className="bg-gray-700 p-4 rounded-lg">
          <div className="flex items-center mb-2">
            <DollarSign className="w-4 h-4 mr-2 text-green-400" />
            <span className="font-mono text-lg">Current Odds</span>
          </div>
          <div className="font-mono text-2xl">
            YES: {yesPercentage || 0}% / NO: {noPercentage || 0}%
          </div>
        </div>

        <div className="bg-gray-700 p-4 rounded-lg">
          <div className="flex items-center mb-2">
            <Users className="w-4 h-4 mr-2 text-green-400" />
            <span className="font-mono text-lg">Participation</span>
          </div>
          <div className="font-mono text-2xl">
            {totalYesNum > 0 && totalNoNum > 0
              ? "Active Market"
              : "Awaiting Bets"}
          </div>
        </div>
      </div>

      <div className="mb-6">
        <h4 className="font-pixel text-lg mb-2">Market Distribution</h4>
        <div className="w-full h-8 bg-gray-700 rounded-lg overflow-hidden flex">
          <div
            className="h-full bg-green-500 flex items-center justify-center font-mono text-xl text-black"
            style={{ width: `${yesPercentage}%` }}
          >
            {yesPercentage > 10 ? `YES ${yesPercentage}%` : ""}
          </div>
          <div
            className="h-full bg-red-500 flex items-center justify-center font-mono text-xl text-black"
            style={{ width: `${noPercentage}%` }}
          >
            {noPercentage > 10 ? `NO ${noPercentage}%` : ""}
          </div>
        </div>
      </div>

      <div>
        <h4 className="font-pixel text-lg mb-2">Market Activity</h4>
        <div className="font-mono text-lg">
          <div className="flex justify-between mb-1">
            <span>YES Tokens:</span>
            <span>{formatNumber(totalYesNum)}</span>
          </div>
          <div className="flex justify-between mb-1">
            <span>NO Tokens:</span>
            <span>{formatNumber(totalNoNum)}</span>
          </div>
          <div className="flex justify-between mb-1">
            <span>Creator:</span>
            <span className="truncate max-w-[150px]">
              {market.creator.substring(0, 6)}...{market.creator.substring(38)}
            </span>
          </div>
          <div className="flex justify-between">
            <span>Market ID:</span>
            <span>{market.id}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
