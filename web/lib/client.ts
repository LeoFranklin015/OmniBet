import { createPublicClient, createWalletClient, custom, http } from "viem";
import { sepolia } from "viem/chains";

export const client = createPublicClient({
  chain: sepolia,
  transport: http("https://endpoints.omniatech.io/v1/eth/sepolia/public"),
});

export const walletClient = createWalletClient({
  chain: sepolia,
  transport: custom(window.ethereum),
});
