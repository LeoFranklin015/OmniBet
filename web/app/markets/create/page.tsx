"use client";

import type React from "react";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, HelpCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import DateTimePicker from "@/app/components/DateTimePicker";
import { client, walletClient } from "@/lib/client";
import { PredictionMarketAddressSepoliaA_ABI } from "@/lib/const";
import { PredictionMarketAddressSepoliaA } from "@/lib/const";
import { useAccount } from "wagmi";

// Disable static generation for this page
export const dynamic = "force-dynamic";

export default function CreateMarketPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [timestamp, setTimestamp] = useState(0);
  const { address } = useAccount();
  const [formData, setFormData] = useState({
    question: "",
    description: "",
    category: "crypto",
    endTime: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // Default to 1 week from now
    chain: "ethereum",
    initialLiquidity: "1",
  });

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleDateChange = (date: Date) => {
    setFormData((prev) => ({ ...prev, endTime: date }));
    console.log(date);
    const timestamp = date.getTime();
    setTimestamp(Math.floor(timestamp / 1000));
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // In a real app, this would be an API call to create the market
      console.log("Creating market with data:", formData);

      if (!address) {
        throw new Error("No account found");
      }

      if (!walletClient) {
        throw new Error("Wallet not connected");
      }

      // Simulate API delay
      const tx = await walletClient.writeContract({
        address: PredictionMarketAddressSepoliaA,
        abi: PredictionMarketAddressSepoliaA_ABI,
        functionName: "createMarket",
        args: [formData.question, timestamp],
        account: address as `0x${string}`,
      });

      console.log("Transaction sent:", tx);

      await client.waitForTransactionReceipt({ hash: tx });

      // Redirect to markets page
      router.push("/markets");
    } catch (error) {
      console.error("Error creating market:", error);
    } finally {
      setIsSubmitting(false);
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

      <div className="bg-gray-800 rounded-lg pixelated-border p-6 mb-8">
        <h1 className="text-3xl font-pixel mb-16">Create New Market</h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block font-pixel text-2xl mb-2">
              Market Question
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <HelpCircle className="w-4 h-4 inline-block ml-2 cursor-help" />
                  </TooltipTrigger>
                  <TooltipContent className="font-mono text-lg">
                    <p>
                      Questions should be clear and have a definitive YES/NO
                      outcome.
                    </p>
                    <p>
                      {`Example: "Will ETH price exceed $5000 by the end of the
                      month?"`}
                    </p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </label>
            <Textarea
              name="question"
              value={formData.question}
              onChange={handleChange}
              placeholder="Will [event] happen by [date]?"
              className="h-20 text-lg"
              required
            />
          </div>

          <div>
            <label className="block font-pixel text-2xl mb-2">
              Market Description (Optional)
            </label>
            <Textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Provide additional details about this market..."
              className="font-mono h-32"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block font-pixel text-sm mb-2">End Time</label>
              <DateTimePicker
                selectedDate={formData.endTime}
                onDateChange={handleDateChange}
              />
            </div>
            <div>
              <label className="block font-pixel text-sm mb-2">
                Initial Liquidity
              </label>
              <div className="relative">
                <Input
                  type="number"
                  name="initialLiquidity"
                  value={1000}
                  onChange={handleChange}
                  min="0.1"
                  step="0.1"
                  className="text-xl pl-8"
                  required
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6"></div>

          <div className="pt-4 border-t border-gray-700">
            <Button
              type="submit"
              className="w-full py-6 bg-green-600 hover:bg-green-500 text-black"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <span className="flex items-center">
                  <span className="w-5 h-5 border-2 border-t-transparent border-white rounded-full animate-spin mr-2 "></span>
                  Creating Market...
                </span>
              ) : (
                "Create Market"
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
