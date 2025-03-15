"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Filter, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import UserMarketCard from "@/app/components/UserMarketCard";
import BettingStats from "@/app/components/BettingStats";
import { ethers } from "ethers";
import { useAccount } from "wagmi";
import { fetchUserMarkets } from "@/lib/fetchUserMarkets";

// Disable static generation for this page
export const dynamic = "force-dynamic";

// Helper function to format timestamp
const formatTimestamp = (timestamp: string) => {
  return new Date(parseInt(timestamp) * 1000);
};

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
  creator: string;
}

interface UserMarketData {
  id: string;
  noBought: string;
  noInMarket: string;
  noSold: string;
  rewards: string;
  spent: string;
  yesInMarket: string;
  yesBought: string;
  yesSold: string;
  claimed: boolean;
  market: {
    claimers: string[];
    createdAt: string;
    creator: string;
    endTime: string;
    id: string;
    liquidityInitialized: boolean;
    marketId: string;
    question: string;
    resolved: boolean;
    result: boolean | null;
    totalPriceToken: string;
    totalNo: string;
    totalYes: string;
    updatedAt: string;
  };
}

export default function MyMarketsPage() {
  const [activeFilter, setActiveFilter] = useState("all");
  const [showFilters, setShowFilters] = useState(false);
  const { address } = useAccount();
  const [userMarkets, setUserMarkets] = useState<UserMarketData[] | null>(null);

  useEffect(() => {
    const fetchUserMarket = async () => {
      if (address) {
        try {
          const result = await fetchUserMarkets(address);

          setUserMarkets(result || []);
        } catch (error) {
          console.error("Error fetching user markets:", error);
          setUserMarkets([]);
        }
      }
    };

    if (address) {
      fetchUserMarket();
    }
  }, [address]);

  // Handle loading state
  if (!userMarkets) {
    return (
      <div className="flex justify-center items-center h-[50vh]">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-t-transparent border-green-500 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="font-pixel">Loading your markets...</p>
        </div>
      </div>
    );
  }

  // Filter markets based on active filter
  const filteredMarkets = userMarkets.filter((market) => {
    if (activeFilter === "all") return true;
    if (activeFilter === "active") return !market.market.resolved;
    if (activeFilter === "resolved") return market.market.resolved;
    if (activeFilter === "won")
      return market.market.resolved && market.market.result;
    if (activeFilter === "claimable")
      return (
        market.market.resolved &&
        market.market.result &&
        !market.market.claimers.includes(market.id.split("-")[0])
      );
    return true;
  });

  // Calculate stats
  const totalBets = userMarkets.length;
  const activeBets = userMarkets.filter((m) => !m.market.resolved).length;
  const wonBets = userMarkets.filter(
    (m) => m.market.resolved && m.market.result
  ).length;
  const totalBetAmount = userMarkets.reduce((sum, m) => {
    return sum + parseFloat(ethers.formatEther(m.spent));
  }, 0);
  const totalWinnings = userMarkets
    .filter((m) => m.market.resolved && m.market.result)
    .reduce((sum, m) => sum + parseFloat(ethers.formatEther(m.rewards)), 0);
  const winRate =
    totalBets > 0
      ? (wonBets / userMarkets.filter((m) => m.market.resolved).length) * 100
      : 0;

  const calculateClaim = (
    yesInMarket: number,
    noInMarket: number,
    won: boolean | null,
    totalYes: number,
    totalNo: number,
    totalPriceToken: number
  ) => {
    if (won === null) return 0;

    if (won) {
      // If YES won, use yesInMarket / totalYes * totalPriceToken
      return (yesInMarket * totalPriceToken) / totalYes;
    } else {
      // If NO won, use noInMarket / totalNo * totalPriceToken
      return (noInMarket * totalPriceToken) / totalNo;
    }
  };

  return (
    <div>
      <Link
        href="/markets"
        className="flex items-center font-pixel text-sm mb-6 hover:text-green-300"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to Markets
      </Link>

      <h1 className="text-3xl font-pixel mb-6">My Markets</h1>

      <BettingStats
        totalBets={totalBets}
        activeBets={activeBets}
        wonBets={wonBets}
        totalBetAmount={totalBetAmount}
        totalWinnings={totalWinnings}
        winRate={winRate}
      />

      <div className="mt-8 bg-gray-800 rounded-lg pixelated-border p-4">
        <div className="flex justify-between items-center">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center font-pixel text-sm"
          >
            <Filter className="w-4 h-4 mr-2" />
            Filters
            <ChevronDown
              className={`w-4 h-4 ml-1 transition-transform ${
                showFilters ? "rotate-180" : ""
              }`}
            />
          </button>

          <Tabs defaultValue="all" onValueChange={setActiveFilter}>
            <TabsList>
              <TabsTrigger value="all" className="font-pixel text-sm">
                All
              </TabsTrigger>
              <TabsTrigger value="active" className="font-pixel text-sm">
                Active
              </TabsTrigger>
              <TabsTrigger value="resolved" className="font-pixel text-sm">
                Resolved
              </TabsTrigger>
              <TabsTrigger value="won" className="font-pixel text-sm">
                Won
              </TabsTrigger>
              <TabsTrigger value="claimable" className="font-pixel text-sm">
                Claimable
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        {showFilters && (
          <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-gray-700 p-3 rounded">
              <h3 className="font-pixel text-2xl mb-2">Sort By</h3>
              <div className="space-y-1 font-mono text-xl">
                <div className="flex items-center">
                  <input
                    type="radio"
                    name="sort"
                    id="sort-recent"
                    className="mr-2"
                    defaultChecked
                  />
                  <label htmlFor="sort-recent">Most Recent</label>
                </div>
                <div className="flex items-center">
                  <input
                    type="radio"
                    name="sort"
                    id="sort-amount"
                    className="mr-2"
                  />
                  <label htmlFor="sort-amount">Bet Amount</label>
                </div>
                <div className="flex items-center">
                  <input
                    type="radio"
                    name="sort"
                    id="sort-end"
                    className="mr-2"
                  />
                  <label htmlFor="sort-end">End Time</label>
                </div>
              </div>
            </div>

            <div className="bg-gray-700 p-3 rounded">
              <h3 className="font-pixel text-2xl mb-2">Position</h3>
              <div className="space-y-1 font-mono text-xl">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="pos-all"
                    className="mr-2"
                    defaultChecked
                  />
                  <label htmlFor="pos-all">All Positions</label>
                </div>
                <div className="flex items-center">
                  <input type="checkbox" id="pos-yes" className="mr-2" />
                  <label htmlFor="pos-yes">YES Positions</label>
                </div>
                <div className="flex items-center">
                  <input type="checkbox" id="pos-no" className="mr-2" />
                  <label htmlFor="pos-no">NO Positions</label>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="mt-8">
        {filteredMarkets.length > 0 ? (
          <div className="grid gap-6">
            {filteredMarkets.map((market) => {
              const formattedMarket: UserMarket = {
                id: market.market.id,
                question: market.market.question,
                endTime: formatTimestamp(market.market.endTime),
                betAmount: parseFloat(ethers.formatEther(market.spent)),
                yesBetAmount: parseFloat(ethers.formatEther(market.yesBought)),
                noBetAmount: parseFloat(ethers.formatEther(market.noBought)),
                yesInMarket: parseFloat(ethers.formatEther(market.yesInMarket)),
                noInMarket: parseFloat(ethers.formatEther(market.noInMarket)),
                rewards: calculateClaim(
                  parseFloat(ethers.formatEther(market.yesInMarket)),
                  parseFloat(ethers.formatEther(market.noInMarket)),
                  market.market.result,
                  parseFloat(ethers.formatEther(market.market.totalYes)),
                  parseFloat(ethers.formatEther(market.market.totalNo)),
                  parseFloat(ethers.formatEther(market.market.totalPriceToken))
                ),
                resolved: market.market.resolved,
                won: market.market.result,
                claimed: market.claimed,
                totalYes: parseFloat(
                  ethers.formatEther(market.market.totalYes)
                ),
                totalNo: parseFloat(ethers.formatEther(market.market.totalNo)),
                createdAt: formatTimestamp(market.market.createdAt),
                updatedAt: formatTimestamp(market.market.updatedAt),
                creator: market.market.creator,
              };

              return (
                <UserMarketCard key={market.id} market={formattedMarket} />
              );
            })}
          </div>
        ) : (
          <div className="bg-gray-800 rounded-lg pixelated-border p-8 text-center">
            <div className="font-pixel text-xl mb-4">No markets found</div>
            <p className="font-mono mb-6">
              {address
                ? "You don't have any markets matching the selected filters."
                : "Connect your wallet to view your markets."}
            </p>
            <Link href="/markets">
              <Button className="font-pixel">Explore Markets</Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
