"use client";

import type React from "react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowRight, Info } from "lucide-react";
import type { Market } from "../components/MarketPreview";

interface BettingInterfaceProps {
  market: Market;
}

// Helper function to convert Wei to ETH
function ethToNumber(weiValue: string): number {
  return parseInt(weiValue) / 1e18;
}

export default function BettingInterface({ market }: BettingInterfaceProps) {
  const [amount, setAmount] = useState("");
  const [estimatedReturn, setEstimatedReturn] = useState("0");
  const [selectedChain, setSelectedChain] = useState("chainA");

  // Convert Wei values to numbers
  const totalYesNum = ethToNumber(market.totalYes);
  const totalNoNum = ethToNumber(market.totalNo);
  const totalStaked = ethToNumber(market.totalPriceToken);

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setAmount(value);

    // Simple estimation calculation
    if (value && !isNaN(Number(value))) {
      const inputAmount = Number(value);
      const yesPercentage = totalYesNum / (totalYesNum + totalNoNum);

      // Simplified LMSR return calculation
      let estimatedReturnValue;
      if (e.target.name === "yes-amount") {
        estimatedReturnValue = inputAmount / yesPercentage;
      } else {
        estimatedReturnValue = inputAmount / (1 - yesPercentage);
      }

      setEstimatedReturn(estimatedReturnValue.toFixed(2));
    } else {
      setEstimatedReturn("0");
    }
  };

  // Convert endTime from seconds to milliseconds for timestamp comparison
  const endTimeMs = Number(market.endTime) * 1000;
  const isDisabled = market.resolved || endTimeMs < Date.now();

  // Chain-specific data (in a real app, this would be different for each chain)
  const chainData = {
    chainA: {
      name: "Sepolia A",
      icon: "E",
      color: "bg-blue-400",
    },
    chainB: {
      name: "Sepolia B",
      icon: "S",
      color: "bg-purple-400",
    },
  };

  const BettingForm = () => (
    <Tabs defaultValue="yes">
      <TabsList className="grid grid-cols-2 mb-4 p-1 bg-gray-700 rounded-lg">
        <TabsTrigger
          value="yes"
          className=" data-[state=active]:bg-green-500 data-[state=active]:text-black transition-all duration-200"
        >
          YES
        </TabsTrigger>
        <TabsTrigger
          value="no"
          className=" data-[state=active]:bg-red-500 data-[state=active]:text-black transition-all duration-200"
        >
          NO
        </TabsTrigger>
      </TabsList>

      <TabsContent value="yes">
        <div className="space-y-4">
          <div>
            <label className="block font-mono text-lg mb-1">
              Amount to Bet
            </label>
            <Input
              type="number"
              name="yes-amount"
              placeholder="0.00"
              value={amount}
              onChange={handleAmountChange}
              className="text-xl p-2"
            />
          </div>

          <div className="bg-gray-700 p-3 rounded-lg">
            <div className="flex justify-between font-mono text-lg mb-1">
              <span>Current Odds</span>
              <span>
                {Math.round((totalYesNum / (totalYesNum + totalNoNum)) * 100)}%
              </span>
            </div>
            <div className="flex justify-between font-mono text-sm">
              <span>Estimated Return</span>
              <span>{estimatedReturn}</span>
            </div>
          </div>

          <Button
            className="w-full font-pixel pixelated-border"
            disabled={!amount || isNaN(Number(amount))}
          >
            Bet on YES <ArrowRight className="ml-2 w-4 h-4" />
          </Button>
        </div>
      </TabsContent>

      <TabsContent value="no">
        <div className="space-y-4">
          <div>
            <label className="block font-mono text-lg mb-1">
              Amount to Bet
            </label>
            <Input
              type="number"
              name="no-amount"
              placeholder="0.00"
              value={amount}
              onChange={handleAmountChange}
              className="text-xl p-2"
            />
          </div>

          <div className="bg-gray-700 p-3 rounded-lg">
            <div className="flex justify-between font-mono text-lg mb-1">
              <span>Current Odds</span>
              <span>
                {Math.round((totalNoNum / (totalYesNum + totalNoNum)) * 100)}%
              </span>
            </div>
            <div className="flex justify-between font-mono text-sm">
              <span>Estimated Return</span>
              <span>{estimatedReturn}</span>
            </div>
          </div>

          <Button
            className="w-full font-pixel pixelated-border"
            disabled={!amount || isNaN(Number(amount))}
          >
            Bet on NO <ArrowRight className="ml-2 w-4 h-4" />
          </Button>
        </div>
      </TabsContent>
    </Tabs>
  );

  return (
    <div className="bg-gray-800 rounded-lg pixelated-border p-6 sticky top-4">
      <h3 className="text-lg font-pixel mb-4">Place Your Bet</h3>

      {isDisabled ? (
        <div className="bg-gray-700 p-4 rounded-lg font-mono text-center mb-4">
          This market is no longer accepting bets
        </div>
      ) : (
        <div>
          <div className="mb-6">
            <h4 className="font-pixel text-sm mb-2">Select Chain</h4>
            <Tabs defaultValue="chainA" onValueChange={setSelectedChain}>
              <TabsList className="grid grid-cols-3 mb-4 p-1 bg-gray-700 rounded-lg">
                {Object.entries(chainData).map(([key, chain]) => (
                  <TabsTrigger
                    key={key}
                    value={key}
                    className="font-pixel data-[state=active]:bg-gray-600 data-[state=active]:shadow-inner transition-all duration-200"
                  >
                    <div className="flex items-center">
                      <div
                        className={`w-4 h-4 ${chain.color} flex items-center justify-center text-black text-xs mr-2 rounded-sm`}
                      >
                        {chain.icon}
                      </div>
                      <span className="hidden sm:inline">{chain.name}</span>
                    </div>
                  </TabsTrigger>
                ))}
              </TabsList>

              {Object.keys(chainData).map((key) => (
                <TabsContent key={key} value={key}>
                  <div className="bg-gray-700 p-3 rounded-lg mb-4">
                    <div className="flex items-center font-mono text-sm">
                      <div
                        className={`w-5 h-5 ${
                          chainData[key as keyof typeof chainData].color
                        } flex items-center justify-center text-black text-xs mr-2 rounded-sm`}
                      >
                        {chainData[key as keyof typeof chainData].icon}
                      </div>
                      <span>
                        Betting on{" "}
                        {chainData[key as keyof typeof chainData].name} Network
                      </span>
                    </div>
                  </div>
                  <div className="bg-gray-700 p-3 rounded-lg mb-4">
                    <button className="w-full font-pixel pixelated-border">
                      Mint USDC
                    </button>
                  </div>
                  <BettingForm />
                </TabsContent>
              ))}
            </Tabs>
          </div>
        </div>
      )}

      <div className="mt-6 bg-gray-700 p-4 rounded-lg">
        <div className="flex items-start font-mono text-sm">
          <Info className="w-4 h-4 mr-2 mt-0.5 flex-shrink-0" />
          <div>
            <p className="mb-2 text-lg">
              OmniBets uses LMSR (Logarithmic Market Scoring Rule) to determine
              prices and payouts.
            </p>
            <p className="text-lg">
              The earlier you bet, the better your potential returns!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
