import { Trophy, TrendingUp, Clock, DollarSign, BarChart } from "lucide-react";

interface BettingStatsProps {
  totalBets: number;
  activeBets: number;
  wonBets: number;
  totalBetAmount: number;
  totalWinnings: number;
  winRate: number;
}

export default function BettingStats({
  totalBets,
  activeBets,
  wonBets,
  totalBetAmount,
  totalWinnings,
  winRate,
}: BettingStatsProps) {
  const netProfit = totalWinnings - totalBetAmount;
  const roi = totalBetAmount > 0 ? (netProfit / totalBetAmount) * 100 : 0;

  return (
    <div className="bg-gray-800 rounded-lg pixelated-border p-6">
      <h2 className="text-xl font-pixel mb-4">Your Betting Stats</h2>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        <div className="bg-gray-700 p-4 rounded-lg">
          <div className="flex items-center mb-2">
            <BarChart className="w-5 h-5 mr-2 text-green-400" />
            <div className="font-pixel text-sm">Total Bets</div>
          </div>
          <div className="text-2xl font-pixel">{totalBets}</div>
        </div>

        <div className="bg-gray-700 p-4 rounded-lg">
          <div className="flex items-center mb-2">
            <Clock className="w-5 h-5 mr-2 text-blue-400" />
            <div className="font-pixel text-sm">Active Bets</div>
          </div>
          <div className="text-2xl font-pixel">{activeBets}</div>
        </div>

        <div className="bg-gray-700 p-4 rounded-lg">
          <div className="flex items-center mb-2">
            <Trophy className="w-5 h-5 mr-2 text-yellow-400" />
            <div className="font-pixel text-sm">Won Bets</div>
          </div>
          <div className="text-2xl font-pixel">{wonBets}</div>
        </div>

        <div className="bg-gray-700 p-4 rounded-lg">
          <div className="flex items-center mb-2">
            <DollarSign className="w-5 h-5 mr-2 text-purple-400" />
            <div className="font-pixel text-sm">Total Bet</div>
          </div>
          <div className="text-2xl font-pixel">
            {totalBetAmount.toFixed(2)} ETH
          </div>
        </div>

        <div className="bg-gray-700 p-4 rounded-lg">
          <div className="flex items-center mb-2">
            <TrendingUp className="w-5 h-5 mr-2 text-green-400" />
            <div className="font-pixel text-sm">Win Rate</div>
          </div>
          <div className="text-2xl font-pixel">{winRate.toFixed(0)}%</div>
        </div>

        <div
          className={`bg-gray-700 p-4 rounded-lg ${
            netProfit >= 0 ? "text-green-400" : "text-red-400"
          }`}
        >
          <div className="flex items-center mb-2">
            <DollarSign className="w-5 h-5 mr-2" />
            <div className="font-pixel text-sm">Net Profit</div>
          </div>
          <div className="text-2xl font-pixel">{netProfit.toFixed(2)} ETH</div>
          <div className="text-xs font-mono">ROI: {roi.toFixed(2)}%</div>
        </div>
      </div>
    </div>
  );
}
