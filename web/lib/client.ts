import { createPublicClient, createWalletClient, custom, http } from "viem";
import { sepolia } from "viem/chains";

// Create public client that works on server and client
export const client = createPublicClient({
  chain: sepolia,
  transport: http("https://endpoints.omniatech.io/v1/eth/sepolia/public"),
});

// Safely create wallet client only in browser environment
export const walletClient =
  typeof window !== "undefined"
    ? createWalletClient({
        chain: sepolia,
        transport: custom(window.ethereum),
      })
    : null;
