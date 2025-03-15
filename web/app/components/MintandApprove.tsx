import { client } from "@/lib/client";
import { walletClient } from "@/lib/client";
import React, { useState } from "react";
import { erc20Abi } from "viem";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { CheckCircle, Loader2 } from "lucide-react";

const MintandApprove = ({
  address,
  usdcAddress,
  marketAddress,
}: {
  address: string;
  usdcAddress: string;
  marketAddress: string;
}) => {
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(0);
  const [open, setOpen] = useState(false);

  const handleMintAndApprove = async () => {
    if (address) {
      setLoading(true);
      setOpen(true);
      setStep(1);

      try {
        if (!walletClient) {
          throw new Error("Wallet not connected");
        }

        const MintTx = await walletClient.writeContract({
          address: usdcAddress as `0x${string}`,
          abi: [
            {
              inputs: [
                { internalType: "address", name: "to", type: "address" },
                { internalType: "uint256", name: "amount", type: "uint256" },
              ],
              name: "mint",
              outputs: [],
              stateMutability: "nonpayable",
              type: "function",
            },
          ],
          functionName: "mint",
          args: [address as `0x${string}`, BigInt(10 * 10 ** 18)],
          account: address as `0x${string}`,
        });
        await client.waitForTransactionReceipt({ hash: MintTx });
        setStep(2);

        const ApproveTx = await walletClient.writeContract({
          address: usdcAddress as `0x${string}`,
          abi: erc20Abi,
          functionName: "approve",
          args: [marketAddress as `0x${string}`, BigInt(10 * 10 ** 18)],
          account: address as `0x${string}`,
        });
        await client.waitForTransactionReceipt({ hash: ApproveTx });
        setStep(3);
      } catch (error) {
        console.error("Transaction failed", error);
      } finally {
        setLoading(false);
        if (step === 3) {
          setTimeout(() => setOpen(false), 1000);
        }
      }
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button
          className={`w-full font-pixel pixelated-border text-yellow-300 px-2 py-2 ${
            loading ? "opacity-50 cursor-not-allowed" : ""
          }`}
          onClick={handleMintAndApprove}
          disabled={loading}
        >
          {loading ? "Processing..." : "Mint & Approve USDC"}
        </button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] bg-gray-900 text-white border-2 border-yellow-300">
        <DialogHeader>
          <DialogTitle className="text-2xl font-pixel text-yellow-300 text-center mb-4">
            Mint & Approve Process
          </DialogTitle>
        </DialogHeader>

        <div className="flex flex-col space-y-6 py-4">
          <StepItem
            step={step}
            index={1}
            label="Minting USDC"
            description="Minting 10 USDC to your wallet"
          />
          <StepItem
            step={step}
            index={2}
            label="Approving USDC"
            description="Approving USDC for the prediction market"
          />
          <StepItem
            step={step}
            index={3}
            label="Completed"
            description="You're ready to participate!"
          />
        </div>

        {step === 3 && (
          <div className="mt-4 text-center">
            <button
              onClick={() => setOpen(false)}
              className="font-pixel pixelated-border text-yellow-300 px-4 py-2 hover:bg-yellow-300/10 transition-colors"
            >
              Close
            </button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

const StepItem = ({
  step,
  index,
  label,
  description,
}: {
  step: number;
  index: number;
  label: string;
  description: string;
}) => (
  <div
    className={`flex items-start space-x-4 transition-all duration-200 ${
      step >= index ? "opacity-100" : "opacity-50"
    }`}
  >
    <div className="flex-shrink-0 w-8 h-8 flex items-center justify-center">
      {step > index ? (
        <CheckCircle className="w-6 h-6 text-green-500" />
      ) : step === index ? (
        <Loader2 className="w-6 h-6 animate-spin text-yellow-300" />
      ) : (
        <div className="w-6 h-6 rounded-full border-2 border-gray-400" />
      )}
    </div>
    <div className="flex flex-col">
      <span
        className={`font-pixel ${
          step >= index ? "text-yellow-300" : "text-gray-400"
        }`}
      >
        {label}
      </span>
      <span className="text-sm text-gray-400 mt-1">{description}</span>
    </div>
  </div>
);

export default MintandApprove;
