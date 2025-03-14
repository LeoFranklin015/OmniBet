export interface Market {
  id: number;
  marketId: string; // BigInt in GraphQL, using string for compatibility
  question: string;
  endTime: number; // Using number for JavaScript Date compatibility
  totalStaked: number;
  totalYes: number;
  totalNo: number;
  resolved: boolean;
  result: boolean | null; // Whether YES won (null if not resolved)
  totalPriceToken: number;
  qYes: string; // Using string to represent UD60x18 (frontend specific)
  qNo: string; // Using string to represent UD60x18 (frontend specific)
  liquidityInitialized: boolean;
  creator: string; // Bytes in GraphQL, using string for addresses
  createdAt: number; // Timestamp
  updatedAt: number; // Timestamp
  claimers: string[]; // Array of addresses
  category: string; // UI-specific for categorization
  chain: string; // UI-specific to show which chain the market is on
}

export const markets: Market[] = [
  {
    id: 1,
    marketId: "1",
    question: "Will Bitcoin reach $100,000 by the end of 2023?",
    endTime: Date.now() + 86400000 * 30, // 30 days from now
    totalStaked: 25000, // keeping for backward compatibility
    totalYes: 15000,
    totalNo: 10000,
    resolved: false,
    result: null,
    totalPriceToken: 30000,
    qYes: "15000000000000000000000", // 15000 in UD60x18 format
    qNo: "10000000000000000000000", // 10000 in UD60x18 format
    liquidityInitialized: true,
    creator: "0x1234567890123456789012345678901234567890",
    createdAt: Date.now() - 86400000 * 10, // 10 days ago
    updatedAt: Date.now() - 86400000 * 5, // 5 days ago
    claimers: [],
    category: "Crypto",
    chain: "ETH",
  },
  {
    id: 2,
    marketId: "2",
    question: "Will Ethereum complete the Surge upgrade in Q1 2024?",
    endTime: Date.now() + 86400000 * 60, // 60 days from now
    totalStaked: 18000,
    totalYes: 12000,
    totalNo: 6000,
    resolved: false,
    result: null,
    totalPriceToken: 20000,
    qYes: "12000000000000000000000",
    qNo: "6000000000000000000000",
    liquidityInitialized: true,
    creator: "0x2345678901234567890123456789012345678901",
    createdAt: Date.now() - 86400000 * 15, // 15 days ago
    updatedAt: Date.now() - 86400000 * 3, // 3 days ago
    claimers: [],
    category: "Crypto",
    chain: "ETH",
  },
  {
    id: 3,
    marketId: "3",
    question: "Will the S&P 500 close above 5,000 by December 31, 2023?",
    endTime: Date.now() + 86400000 * 45, // 45 days from now
    totalStaked: 30000,
    totalYes: 18000,
    totalNo: 12000,
    resolved: false,
    result: null,
    totalPriceToken: 35000,
    qYes: "18000000000000000000000",
    qNo: "12000000000000000000000",
    liquidityInitialized: true,
    creator: "0x3456789012345678901234567890123456789012",
    createdAt: Date.now() - 86400000 * 20, // 20 days ago
    updatedAt: Date.now() - 86400000 * 2, // 2 days ago
    claimers: [],
    category: "Finance",
    chain: "AVAX",
  },
  {
    id: 4,
    marketId: "4",
    question: "Will the US Federal Reserve cut interest rates in Q4 2023?",
    endTime: Date.now() + 86400000 * 20, // 20 days from now
    totalStaked: 22000,
    totalYes: 8000,
    totalNo: 14000,
    resolved: false,
    result: null,
    totalPriceToken: 25000,
    qYes: "8000000000000000000000",
    qNo: "14000000000000000000000",
    liquidityInitialized: true,
    creator: "0x4567890123456789012345678901234567890123",
    createdAt: Date.now() - 86400000 * 25, // 25 days ago
    updatedAt: Date.now() - 86400000 * 1, // 1 day ago
    claimers: [],
    category: "Finance",
    chain: "SOL",
  },
  {
    id: 5,
    marketId: "5",
    question: "Will OpenAI release GPT-5 before the end of 2023?",
    endTime: Date.now() - 86400000 * 10, // 10 days ago (resolved)
    totalStaked: 15000,
    totalYes: 9000,
    totalNo: 6000,
    resolved: true,
    result: false, // NO won
    totalPriceToken: 18000,
    qYes: "9000000000000000000000",
    qNo: "6000000000000000000000",
    liquidityInitialized: true,
    creator: "0x5678901234567890123456789012345678901234",
    createdAt: Date.now() - 86400000 * 30, // 30 days ago
    updatedAt: Date.now() - 86400000 * 10, // 10 days ago (when resolved)
    claimers: [
      "0xabc1234567890123456789012345678901234567",
      "0xdef1234567890123456789012345678901234567",
    ],
    category: "Tech",
    chain: "MATIC",
  },
  {
    id: 6,
    marketId: "6",
    question: "Will Apple release a foldable iPhone in 2024?",
    endTime: Date.now() + 86400000 * 90, // 90 days from now
    totalStaked: 12000,
    totalYes: 3000,
    totalNo: 9000,
    resolved: false,
    result: null,
    totalPriceToken: 15000,
    qYes: "3000000000000000000000",
    qNo: "9000000000000000000000",
    liquidityInitialized: true,
    creator: "0x6789012345678901234567890123456789012345",
    createdAt: Date.now() - 86400000 * 5, // 5 days ago
    updatedAt: Date.now() - 86400000 * 2, // 2 days ago
    claimers: [],
    category: "Tech",
    chain: "BTC",
  },
  {
    id: 7,
    marketId: "7",
    question: "Will the 2024 Olympics in Paris have more than 10,000 athletes?",
    endTime: Date.now() + 86400000 * 180, // 180 days from now
    totalStaked: 8000,
    totalYes: 5000,
    totalNo: 3000,
    resolved: false,
    result: null,
    totalPriceToken: 10000,
    qYes: "5000000000000000000000",
    qNo: "3000000000000000000000",
    liquidityInitialized: true,
    creator: "0x7890123456789012345678901234567890123456",
    createdAt: Date.now() - 86400000 * 8, // 8 days ago
    updatedAt: Date.now() - 86400000 * 1, // 1 day ago
    claimers: [],
    category: "Sports",
    chain: "ETH",
  },
  {
    id: 8,
    marketId: "8",
    question: "Will SpaceX successfully land humans on Mars by 2025?",
    endTime: Date.now() + 86400000 * 365, // 365 days from now
    totalStaked: 40000,
    totalYes: 10000,
    totalNo: 30000,
    resolved: false,
    result: null,
    totalPriceToken: 45000,
    qYes: "10000000000000000000000",
    qNo: "30000000000000000000000",
    liquidityInitialized: true,
    creator: "0x8901234567890123456789012345678901234567",
    createdAt: Date.now() - 86400000 * 12, // 12 days ago
    updatedAt: Date.now() - 86400000 * 3, // 3 days ago
    claimers: [],
    category: "Science",
    chain: "SOL",
  },
];
