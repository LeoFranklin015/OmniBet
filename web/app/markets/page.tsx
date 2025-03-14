"use client";
import { useEffect, useState } from "react";
import MarketPreview from "../components/MarketPreview";
import { Market } from "../components/MarketPreview";
import { fetchMarkets } from "@/lib/fetchMarkets";
import { Loader2 } from "lucide-react";

export default function MarketsPage() {
  const [markets, setMarkets] = useState<Market[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMarket = async () => {
      const markets = await fetchMarkets();
      setMarkets(markets as Market[]);
      setLoading(false);
    };
    fetchMarket();
  }, []);

  return (
    <div>
      <h1 className="text-3xl font-pixel mb-6">Prediction Markets</h1>
      {loading ? (
        <div className="flex justify-center items-center h-screen">
          <Loader2 className="w-40 h-40 animate-spin" />
        </div>
      ) : (
        <div className="mt-8 space-y-12">
          <div className="grid gap-6">
            {markets.map((market) => (
              <MarketPreview key={market.id} market={market} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
