"use client";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Loader2 } from "lucide-react";
import MarketDetails from "../../components/MarketDetails";
import BettingInterface from "../../components/BettingInterface";
import MarketStats from "../../components/MarketStats";
import type { Market } from "../../components/MarketPreview";
import { useEffect, useState } from "react";
import { fetchMarket } from "@/lib/fetchMarket";

export default function MarketPage({ params }: { params: { id: string } }) {
  // For demo purposes, we'll use the mock data
  // In a real app, you would fetch this data based on the ID
  console.log(params.id);

  const [market, setMarket] = useState<Market | null>(null);
  const [loading, setLoading] = useState<boolean | null>(null);

  useEffect(() => {
    const FetchMarket = async () => {
      setLoading(true); // Make sure loading is explicitly set to true
      try {
        console.log("Fetching market with ID:", params.id);
        const fetchedMarket = await fetchMarket(params.id);
        console.log("Fetched market data:", fetchedMarket);
        if (!fetchedMarket) {
          console.error("Market not found!");
        }
        setMarket(fetchedMarket);
      } catch (error) {
        console.error("Error fetching market:", error);
      } finally {
        setLoading(false);
      }
    };

    if (params.id) {
      FetchMarket();
    }
  }, [params.id]);

  if (!market && loading === false) {
    return notFound();
  }
  // Convert the market data to the format expected by our components
  // Keep original string values as required by the Market interface
  const formattedMarket: Market = {
    id: market?.id || "",
    question: market?.question || "",
    endTime: market?.endTime || "",
    resolved: market?.resolved || false,
    result: market?.resolved ? !!market?.result : false,
    totalYes: market?.totalYes || "",
    totalNo: market?.totalNo || "",
    totalPriceToken: market?.totalPriceToken || "",
    creator: market?.creator || "",
    marketId: market?.marketId || "",
    liquidityInitialized: market?.liquidityInitialized || false,
    claimers: market?.claimers || [],
    createdAt: market?.createdAt || "",
    updatedAt: market?.updatedAt || "",
  };

  return (
    <div>
      {loading ? (
        <div className="flex justify-center items-center h-screen">
          <Loader2 className="w-40 h-40 animate-spin" />
        </div>
      ) : (
        <>
          <Link
            href="/markets"
            className="flex items-center font-pixel text-sm mb-6 hover:text-green-300"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Markets
          </Link>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <MarketDetails market={formattedMarket} />
              <MarketStats market={formattedMarket} className="mt-8" />
              {/* <LmsrExplainer className="mt-8" /> */}
            </div>

            <div>
              <BettingInterface market={formattedMarket} />
            </div>
          </div>
        </>
      )}
    </div>
  );
}
