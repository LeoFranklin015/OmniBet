import { client } from "@/lib/client";
import React, { useEffect, useState } from "react";
import { erc20Abi } from "viem";

const USDCBalance = ({
  usdcAddress,
  address,
}: {
  usdcAddress: string;
  address: string;
}) => {
  const [balance, setBalance] = useState(0);

  useEffect(() => {
    if (address && usdcAddress) {
      const fetchBalance = async () => {
        const balance = await client.readContract({
          address: usdcAddress as `0x${string}`,
          abi: erc20Abi,
          functionName: "balanceOf",
          args: [address as `0x${string}`],
        });
        setBalance(Number(balance) / 10 ** 18);
      };
      fetchBalance();
    }
  }, [usdcAddress, address]);
  return (
    <div>
      <h3 className="flex items-center gap-3 px-2 py-2  hover:text-black rounded pixelated-border hover:bg-yellow-500 transition-colors text-green-500 text-lg">
        {balance} USDC
      </h3>
    </div>
  );
};

export default USDCBalance;
