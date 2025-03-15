import { Clock, User, AlertTriangle, Check, X } from "lucide-react";
import type { Market } from "../components/MarketPreview";

interface MarketDetailsProps {
  market: Market;
}

export default function MarketDetails({ market }: MarketDetailsProps) {
  // Convert endTime from seconds to milliseconds
  const endTimeMs = Number(market.endTime) * 1000;
  const timeLeft = endTimeMs - Date.now();
  const isEnded = timeLeft <= 0;

  // Format time left
  const formatTimeLeft = () => {
    if (isEnded) return "Market has ended";

    const days = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
    const hours = Math.floor(
      (timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
    );
    const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));

    return `${days}d ${hours}h ${minutes}m remaining`;
  };

  // Format date
  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="bg-gray-800 rounded-lg pixelated-border p-6">
      <div className="flex items-center mb-4">
        {market.resolved && (
          <span
            className={`inline-block px-2 py-1 ${
              market.result ? "bg-green-600" : "bg-red-600"
            } text-black text-lg font-mono rounded flex items-center`}
          >
            {market.result ? (
              <Check className="w-3 h-3 mr-1" />
            ) : (
              <X className="w-3 h-3 mr-1" />
            )}
            {market.result ? "YES WON" : "NO WON"}
          </span>
        )}
      </div>

      <h1 className="text-2xl font-pixel mb-4">{market.question}</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div className="flex items-center font-mono">
          <Clock className="w-4 h-4 mr-2" />
          <div>
            <div className="text-2xl opacity-70">End Time</div>
            <div>{formatDate(endTimeMs)}</div>
            <div className="text-2xl">{formatTimeLeft()}</div>
          </div>
        </div>

        <div className="flex items-center font-mono">
          <User className="w-8 h-8 mr-2" />
          <div>
            <div className="text-xl opacity-70">Created By</div>
            <div className="truncate text-2xl">
              {market.creator.substring(0, 6)}...{market.creator.substring(38)}
            </div>
          </div>
        </div>
      </div>

      {!market.resolved && isEnded && (
        <div className="bg-yellow-900 border border-yellow-600 text-yellow-200 p-4 rounded-lg mb-6 flex items-start">
          <AlertTriangle className="w-5 h-5 mr-2 flex-shrink-0 mt-0.5" />
          <div className="font-mono text-sm">
            This market has ended but has not been resolved yet. The outcome
            will be determined soon.
          </div>
        </div>
      )}

      {market.resolved && (
        <div
          className={`${
            market.result
              ? "bg-green-900 border-green-600 text-green-200"
              : "bg-red-900 border-red-600 text-red-200"
          } border p-4 rounded-lg mb-6 flex items-start`}
        >
          {market.result ? (
            <Check className="w-5 h-5 mr-2 flex-shrink-0 mt-0.5" />
          ) : (
            <X className="w-5 h-5 mr-2 flex-shrink-0 mt-0.5" />
          )}
          <div className="font-mono text-sm">
            This market has been resolved. The outcome is{" "}
            <strong>{market.result ? "YES" : "NO"}</strong>.
          </div>
        </div>
      )}

      <div className="font-mono">
        <h3 className="text-lg font-pixel mb-2">Market Description</h3>
        <p className="mb-4 text-lg">
          This prediction market uses the Logarithmic Market Scoring Rule (LMSR)
          to determine prices. The market resolves to YES if the condition is
          met, otherwise it resolves to NO.
        </p>
        <p className="text-lg">
          The market will be resolved based on reliable data sources and oracle
          services. All trades are final and cannot be reversed once confirmed.
        </p>
      </div>
    </div>
  );
}
