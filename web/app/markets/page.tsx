"use client";
import { useEffect, useState } from "react";
import MarketPreview from "../components/MarketPreview";
import { Market } from "../components/MarketPreview";
import { fetchMarkets } from "@/lib/fetchMarkets";
import { Loader2 } from "lucide-react";
import Link from "next/link";

export default function MarketsPage() {
  const [markets, setMarkets] = useState<Market[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMarket = async () => {
      const markets = await fetchMarkets();
      markets.sort((a: Market, b: Market) =>
        a.createdAt < b.createdAt ? 1 : -1
      );
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
        <>
          {markets.length > 0 ? (
            <div className="mt-8 space-y-12">
              <div className="grid gap-6">
                {markets.map((market) => (
                  <MarketPreview key={market.id} market={market} />
                ))}
              </div>
            </div>
          ) : (
            <div className="flex flex-col justify-center gap-8 items-center h-screen">
              <p className="text-2xl font-pixel">No markets found</p>
              <Link href="/markets/create">
                <button
                  style={{ display: "flex", alignItems: "center" }}
                  type="button"
                  className="flex items-center gap-3 px-2 py-2  hover:text-black rounded pixelated-border hover:bg-yellow-500 transition-colors text-green-500"
                >
                  Create Market
                </button>
              </Link>
            </div>
          )}
        </>
      )}
    </div>
  );
}
