export const GRAPH_URL =
  "https://api.studio.thegraph.com/query/73364/omnibet/version/latest";

export const USDC_ADDRESS_SEPOLIA_A =
  "0x408709d933DA1337f1027d13fCF6e081a47FE71a";
export const USDC_ADDRESS_SEPOLIA_B =
  "0x35ACAEBeA3c9EDcc8B0C8aB9e33066C332d29b72";

export const PredictionMarketAddressSepoliaA =
  "0x0E2119Ccd170485543A77FD4fEc06D0668A350a1";
export const PredictionMarketAddressSepoliaB =
  "0x1033e19794D5f63672Aa1Cb1d1B243F2F3400E94";

export const PredictionMarketAddressSepoliaA_ABI = [
  {
    type: "constructor",
    inputs: [
      { name: "_callback_sender", type: "address", internalType: "address" },
      { name: "_priceToken", type: "address", internalType: "address" },
    ],
    stateMutability: "payable",
  },
  { type: "receive", stateMutability: "payable" },
  {
    type: "function",
    name: "addLiquidity",
    inputs: [
      { name: "marketId", type: "uint256", internalType: "uint256" },
      { name: "amount", type: "uint256", internalType: "uint256" },
    ],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "buy",
    inputs: [
      { name: "marketId", type: "uint256", internalType: "uint256" },
      { name: "isYesToken", type: "bool", internalType: "bool" },
      { name: "amount", type: "uint256", internalType: "UD60x18" },
    ],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "claimReward",
    inputs: [{ name: "marketId", type: "uint256", internalType: "uint256" }],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "coverDebt",
    inputs: [],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "createMarket",
    inputs: [
      { name: "_question", type: "string", internalType: "string" },
      { name: "_endTime", type: "uint256", internalType: "uint256" },
    ],
    outputs: [{ name: "marketId", type: "uint256", internalType: "uint256" }],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "emergencyWithdraw",
    inputs: [
      { name: "marketId", type: "uint256", internalType: "uint256" },
      { name: "token", type: "address", internalType: "address" },
      { name: "amount", type: "uint256", internalType: "uint256" },
    ],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "getBalances",
    inputs: [
      { name: "marketId", type: "uint256", internalType: "uint256" },
      { name: "account", type: "address", internalType: "address" },
    ],
    outputs: [
      { name: "priceTokenBalance", type: "uint256", internalType: "uint256" },
      { name: "yesTokenBalance", type: "uint256", internalType: "uint256" },
      { name: "noTokenBalance", type: "uint256", internalType: "uint256" },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "getCost",
    inputs: [
      { name: "marketId", type: "uint256", internalType: "uint256" },
      { name: "isYesToken", type: "bool", internalType: "bool" },
      { name: "amount", type: "uint256", internalType: "UD60x18" },
    ],
    outputs: [{ name: "price", type: "uint256", internalType: "UD60x18" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "getMarketCount",
    inputs: [],
    outputs: [{ name: "", type: "uint256", internalType: "uint256" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "getMarketState",
    inputs: [{ name: "marketId", type: "uint256", internalType: "uint256" }],
    outputs: [
      {
        name: "marketState",
        type: "tuple",
        internalType: "struct PredictionMarketV2.Market",
        components: [
          { name: "id", type: "uint256", internalType: "uint256" },
          { name: "question", type: "string", internalType: "string" },
          { name: "endTime", type: "uint256", internalType: "uint256" },
          { name: "totalStaked", type: "uint256", internalType: "uint256" },
          { name: "totalYes", type: "uint256", internalType: "uint256" },
          { name: "totalNo", type: "uint256", internalType: "uint256" },
          { name: "resolved", type: "bool", internalType: "bool" },
          { name: "won", type: "bool", internalType: "bool" },
          { name: "totalPriceToken", type: "uint256", internalType: "uint256" },
          { name: "qYes", type: "uint256", internalType: "UD60x18" },
          { name: "qNo", type: "uint256", internalType: "UD60x18" },
          { name: "liquidityInitialized", type: "bool", internalType: "bool" },
          { name: "creator", type: "address", internalType: "address" },
          {
            name: "priceTokenFromDestination",
            type: "uint256",
            internalType: "uint256",
          },
        ],
      },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "getTokenPrice",
    inputs: [
      { name: "marketId", type: "uint256", internalType: "uint256" },
      { name: "isYesToken", type: "bool", internalType: "bool" },
    ],
    outputs: [{ name: "price", type: "uint256", internalType: "UD60x18" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "getTokenQuantities",
    inputs: [{ name: "marketId", type: "uint256", internalType: "uint256" }],
    outputs: [
      { name: "yesQuantity", type: "uint256", internalType: "UD60x18" },
      { name: "noQuantity", type: "uint256", internalType: "UD60x18" },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "initializeLiquidity",
    inputs: [{ name: "marketId", type: "uint256", internalType: "uint256" }],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "marketCount",
    inputs: [],
    outputs: [{ name: "", type: "uint256", internalType: "uint256" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "markets",
    inputs: [{ name: "", type: "uint256", internalType: "uint256" }],
    outputs: [
      { name: "id", type: "uint256", internalType: "uint256" },
      { name: "question", type: "string", internalType: "string" },
      { name: "endTime", type: "uint256", internalType: "uint256" },
      { name: "totalStaked", type: "uint256", internalType: "uint256" },
      { name: "totalYes", type: "uint256", internalType: "uint256" },
      { name: "totalNo", type: "uint256", internalType: "uint256" },
      { name: "resolved", type: "bool", internalType: "bool" },
      { name: "won", type: "bool", internalType: "bool" },
      { name: "totalPriceToken", type: "uint256", internalType: "uint256" },
      { name: "qYes", type: "uint256", internalType: "UD60x18" },
      { name: "qNo", type: "uint256", internalType: "UD60x18" },
      { name: "liquidityInitialized", type: "bool", internalType: "bool" },
      { name: "creator", type: "address", internalType: "address" },
      {
        name: "priceTokenFromDestination",
        type: "uint256",
        internalType: "uint256",
      },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "noBalances",
    inputs: [
      { name: "", type: "uint256", internalType: "uint256" },
      { name: "", type: "address", internalType: "address" },
    ],
    outputs: [{ name: "", type: "uint256", internalType: "uint256" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "owner",
    inputs: [],
    outputs: [{ name: "", type: "address", internalType: "address" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "pay",
    inputs: [{ name: "amount", type: "uint256", internalType: "uint256" }],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "priceToken",
    inputs: [],
    outputs: [{ name: "", type: "address", internalType: "contract MockUSDC" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "renounceOwnership",
    inputs: [],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "resolve",
    inputs: [
      { name: "marketId", type: "uint256", internalType: "uint256" },
      { name: "isYesWon", type: "bool", internalType: "bool" },
      { name: "proof", type: "bytes", internalType: "bytes" },
    ],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "transferOwnership",
    inputs: [{ name: "newOwner", type: "address", internalType: "address" }],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "updateMarket",
    inputs: [
      { name: "", type: "address", internalType: "address" },
      { name: "marketId", type: "uint256", internalType: "uint256" },
      { name: "isYesToken", type: "bool", internalType: "bool" },
      { name: "_amount", type: "uint256", internalType: "uint256" },
      { name: "account", type: "address", internalType: "address" },
      { name: "cost", type: "uint256", internalType: "uint256" },
    ],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "yesBalances",
    inputs: [
      { name: "", type: "uint256", internalType: "uint256" },
      { name: "", type: "address", internalType: "address" },
    ],
    outputs: [{ name: "", type: "uint256", internalType: "uint256" }],
    stateMutability: "view",
  },
  {
    type: "event",
    name: "EmergencyLiquidityAdded",
    inputs: [
      {
        name: "owner",
        type: "address",
        indexed: true,
        internalType: "address",
      },
      {
        name: "marketId",
        type: "uint256",
        indexed: true,
        internalType: "uint256",
      },
      {
        name: "amount",
        type: "uint256",
        indexed: false,
        internalType: "uint256",
      },
    ],
    anonymous: false,
  },
  {
    type: "event",
    name: "LiquidityAdded",
    inputs: [
      {
        name: "provider",
        type: "address",
        indexed: true,
        internalType: "address",
      },
      {
        name: "marketId",
        type: "uint256",
        indexed: true,
        internalType: "uint256",
      },
      {
        name: "amount",
        type: "uint256",
        indexed: false,
        internalType: "uint256",
      },
    ],
    anonymous: false,
  },
  {
    type: "event",
    name: "MarketCreated",
    inputs: [
      {
        name: "marketId",
        type: "uint256",
        indexed: true,
        internalType: "uint256",
      },
      {
        name: "question",
        type: "string",
        indexed: false,
        internalType: "string",
      },
      {
        name: "endTime",
        type: "uint256",
        indexed: false,
        internalType: "uint256",
      },
      {
        name: "creator",
        type: "address",
        indexed: false,
        internalType: "address",
      },
    ],
    anonymous: false,
  },
  {
    type: "event",
    name: "MarketResolved",
    inputs: [
      {
        name: "marketId",
        type: "uint256",
        indexed: true,
        internalType: "uint256",
      },
      { name: "result", type: "bool", indexed: false, internalType: "bool" },
      {
        name: "totalPriceToken",
        type: "uint256",
        indexed: false,
        internalType: "uint256",
      },
    ],
    anonymous: false,
  },
  {
    type: "event",
    name: "MarketUpdated",
    inputs: [
      {
        name: "marketId",
        type: "uint256",
        indexed: true,
        internalType: "uint256",
      },
      {
        name: "isYesToken",
        type: "bool",
        indexed: false,
        internalType: "bool",
      },
      {
        name: "amount",
        type: "uint256",
        indexed: false,
        internalType: "uint256",
      },
      {
        name: "account",
        type: "address",
        indexed: false,
        internalType: "address",
      },
      {
        name: "cost",
        type: "uint256",
        indexed: false,
        internalType: "uint256",
      },
    ],
    anonymous: false,
  },
  {
    type: "event",
    name: "OwnershipTransferred",
    inputs: [
      {
        name: "previousOwner",
        type: "address",
        indexed: true,
        internalType: "address",
      },
      {
        name: "newOwner",
        type: "address",
        indexed: true,
        internalType: "address",
      },
    ],
    anonymous: false,
  },
  {
    type: "event",
    name: "RewardClaimed",
    inputs: [
      { name: "user", type: "address", indexed: true, internalType: "address" },
      {
        name: "marketId",
        type: "uint256",
        indexed: true,
        internalType: "uint256",
      },
      {
        name: "rewardAmount",
        type: "uint256",
        indexed: false,
        internalType: "uint256",
      },
    ],
    anonymous: false,
  },
  {
    type: "event",
    name: "TokenOperation",
    inputs: [
      { name: "user", type: "address", indexed: true, internalType: "address" },
      {
        name: "marketId",
        type: "uint256",
        indexed: true,
        internalType: "uint256",
      },
      { name: "opType", type: "uint8", indexed: false, internalType: "uint8" },
      {
        name: "tokenType",
        type: "uint8",
        indexed: false,
        internalType: "uint8",
      },
      {
        name: "amount",
        type: "uint256",
        indexed: false,
        internalType: "uint256",
      },
      {
        name: "cost",
        type: "uint256",
        indexed: false,
        internalType: "uint256",
      },
    ],
    anonymous: false,
  },
  {
    type: "error",
    name: "OwnableInvalidOwner",
    inputs: [{ name: "owner", type: "address", internalType: "address" }],
  },
  {
    type: "error",
    name: "OwnableUnauthorizedAccount",
    inputs: [{ name: "account", type: "address", internalType: "address" }],
  },
  { type: "error", name: "ReentrancyGuardReentrantCall", inputs: [] },
  {
    type: "error",
    name: "SafeERC20FailedOperation",
    inputs: [{ name: "token", type: "address", internalType: "address" }],
  },
];

export const PredictionMarketAddressSepoliaB_ABI = [
  {
    type: "constructor",
    inputs: [
      { name: "_callback_sender", type: "address", internalType: "address" },
      { name: "_priceToken", type: "address", internalType: "address" },
      { name: "_burner_address", type: "address", internalType: "address" },
    ],
    stateMutability: "payable",
  },
  { type: "receive", stateMutability: "payable" },
  {
    type: "function",
    name: "LIQUIDITY_PARAMETER",
    inputs: [],
    outputs: [{ name: "", type: "uint256", internalType: "UD60x18" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "burner_address",
    inputs: [],
    outputs: [{ name: "", type: "address", internalType: "address" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "buy",
    inputs: [
      { name: "marketId", type: "uint256", internalType: "uint256" },
      { name: "isYesToken", type: "bool", internalType: "bool" },
      { name: "amount", type: "uint256", internalType: "UD60x18" },
    ],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "coverDebt",
    inputs: [],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "createMarket",
    inputs: [
      { name: "", type: "address", internalType: "address" },
      { name: "marketId", type: "uint256", internalType: "uint256" },
    ],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "getCost",
    inputs: [
      { name: "marketId", type: "uint256", internalType: "uint256" },
      { name: "isYesToken", type: "bool", internalType: "bool" },
      { name: "amount", type: "uint256", internalType: "UD60x18" },
    ],
    outputs: [{ name: "price", type: "uint256", internalType: "UD60x18" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "getMarket",
    inputs: [{ name: "marketId", type: "uint256", internalType: "uint256" }],
    outputs: [
      {
        name: "",
        type: "tuple",
        internalType: "struct PredictionMarketSepolia.Market",
        components: [
          { name: "id", type: "uint256", internalType: "uint256" },
          { name: "qyes", type: "uint256", internalType: "UD60x18" },
          { name: "qno", type: "uint256", internalType: "UD60x18" },
          { name: "totalCost", type: "uint256", internalType: "uint256" },
          { name: "resolved", type: "bool", internalType: "bool" },
        ],
      },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "getMarketIds",
    inputs: [],
    outputs: [{ name: "", type: "uint256[]", internalType: "uint256[]" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "marketIds",
    inputs: [{ name: "", type: "uint256", internalType: "uint256" }],
    outputs: [{ name: "", type: "uint256", internalType: "uint256" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "markets",
    inputs: [{ name: "", type: "uint256", internalType: "uint256" }],
    outputs: [
      { name: "id", type: "uint256", internalType: "uint256" },
      { name: "qyes", type: "uint256", internalType: "UD60x18" },
      { name: "qno", type: "uint256", internalType: "UD60x18" },
      { name: "totalCost", type: "uint256", internalType: "uint256" },
      { name: "resolved", type: "bool", internalType: "bool" },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "pay",
    inputs: [{ name: "amount", type: "uint256", internalType: "uint256" }],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "priceToken",
    inputs: [],
    outputs: [{ name: "", type: "address", internalType: "contract MockUSDC" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "resolveMarket",
    inputs: [
      { name: "", type: "address", internalType: "address" },
      { name: "marketId", type: "uint256", internalType: "uint256" },
    ],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "updateMarket",
    inputs: [
      { name: "", type: "address", internalType: "address" },
      { name: "marketId", type: "uint256", internalType: "uint256" },
      { name: "isYesToken", type: "bool", internalType: "bool" },
      { name: "amount", type: "uint256", internalType: "uint256" },
    ],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "event",
    name: "MarketCreated",
    inputs: [
      {
        name: "marketId",
        type: "uint256",
        indexed: false,
        internalType: "uint256",
      },
    ],
    anonymous: false,
  },
  {
    type: "event",
    name: "MarketResolved",
    inputs: [
      {
        name: "marketId",
        type: "uint256",
        indexed: false,
        internalType: "uint256",
      },
      {
        name: "totalCost",
        type: "uint256",
        indexed: false,
        internalType: "uint256",
      },
    ],
    anonymous: false,
  },
  {
    type: "event",
    name: "MarketUpdated",
    inputs: [
      {
        name: "marketId",
        type: "uint256",
        indexed: false,
        internalType: "uint256",
      },
      {
        name: "isYesToken",
        type: "bool",
        indexed: false,
        internalType: "bool",
      },
      {
        name: "amount",
        type: "uint256",
        indexed: false,
        internalType: "uint256",
      },
    ],
    anonymous: false,
  },
  {
    type: "event",
    name: "TokenBought",
    inputs: [
      {
        name: "marketId",
        type: "uint256",
        indexed: false,
        internalType: "uint256",
      },
      {
        name: "tokenType",
        type: "uint256",
        indexed: false,
        internalType: "uint256",
      },
      {
        name: "amount",
        type: "uint256",
        indexed: false,
        internalType: "uint256",
      },
      {
        name: "cost",
        type: "uint256",
        indexed: false,
        internalType: "uint256",
      },
      {
        name: "buyer",
        type: "address",
        indexed: false,
        internalType: "address",
      },
    ],
    anonymous: false,
  },
];
