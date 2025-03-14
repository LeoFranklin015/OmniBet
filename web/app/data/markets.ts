export interface Market {
  id: number
  question: string
  endTime: number
  totalStaked: number
  totalYes: number
  totalNo: number
  resolved: boolean
  won: boolean
  totalPriceToken: number
  qYes: string // Using string to represent UD60x18
  qNo: string // Using string to represent UD60x18
  liquidityInitialized: boolean
  creator: string
  category?: string // Added for UI categorization
  chain?: string // Added to show which chain the market is on
}

export const markets: Market[] = [
  {
    id: 1,
    question: "Will Bitcoin reach $100,000 by the end of 2023?",
    endTime: Date.now() + 86400000 * 30, // 30 days from now
    totalStaked: 25000,
    totalYes: 15000,
    totalNo: 10000,
    resolved: false,
    won: false,
    totalPriceToken: 30000,
    qYes: "15000000000000000000000", // 15000 in UD60x18 format
    qNo: "10000000000000000000000", // 10000 in UD60x18 format
    liquidityInitialized: true,
    creator: "0x1234567890123456789012345678901234567890",
    category: "Crypto",
    chain: "ETH",
  },
  {
    id: 2,
    question: "Will Ethereum complete the Surge upgrade in Q1 2024?",
    endTime: Date.now() + 86400000 * 60, // 60 days from now
    totalStaked: 18000,
    totalYes: 12000,
    totalNo: 6000,
    resolved: false,
    won: false,
    totalPriceToken: 20000,
    qYes: "12000000000000000000000",
    qNo: "6000000000000000000000",
    liquidityInitialized: true,
    creator: "0x2345678901234567890123456789012345678901",
    category: "Crypto",
    chain: "ETH",
  },
  {
    id: 3,
    question: "Will the S&P 500 close above 5,000 by December 31, 2023?",
    endTime: Date.now() + 86400000 * 45, // 45 days from now
    totalStaked: 30000,
    totalYes: 18000,
    totalNo: 12000,
    resolved: false,
    won: false,
    totalPriceToken: 35000,
    qYes: "18000000000000000000000",
    qNo: "12000000000000000000000",
    liquidityInitialized: true,
    creator: "0x3456789012345678901234567890123456789012",
    category: "Finance",
    chain: "AVAX",
  },
  {
    id: 4,
    question: "Will the US Federal Reserve cut interest rates in Q4 2023?",
    endTime: Date.now() + 86400000 * 20, // 20 days from now
    totalStaked: 22000,
    totalYes: 8000,
    totalNo: 14000,
    resolved: false,
    won: false,
    totalPriceToken: 25000,
    qYes: "8000000000000000000000",
    qNo: "14000000000000000000000",
    liquidityInitialized: true,
    creator: "0x4567890123456789012345678901234567890123",
    category: "Finance",
    chain: "SOL",
  },
  {
    id: 5,
    question: "Will OpenAI release GPT-5 before the end of 2023?",
    endTime: Date.now() - 86400000 * 10, // 10 days ago (resolved)
    totalStaked: 15000,
    totalYes: 9000,
    totalNo: 6000,
    resolved: true,
    won: false, // NO won
    totalPriceToken: 18000,
    qYes: "9000000000000000000000",
    qNo: "6000000000000000000000",
    liquidityInitialized: true,
    creator: "0x5678901234567890123456789012345678901234",
    category: "Tech",
    chain: "MATIC",
  },
  {
    id: 6,
    question: "Will Apple release a foldable iPhone in 2024?",
    endTime: Date.now() + 86400000 * 90, // 90 days from now
    totalStaked: 12000,
    totalYes: 3000,
    totalNo: 9000,
    resolved: false,
    won: false,
    totalPriceToken: 15000,
    qYes: "3000000000000000000000",
    qNo: "9000000000000000000000",
    liquidityInitialized: true,
    creator: "0x6789012345678901234567890123456789012345",
    category: "Tech",
    chain: "BTC",
  },
  {
    id: 7,
    question: "Will the 2024 Olympics in Paris have more than 10,000 athletes?",
    endTime: Date.now() + 86400000 * 180, // 180 days from now
    totalStaked: 8000,
    totalYes: 5000,
    totalNo: 3000,
    resolved: false,
    won: false,
    totalPriceToken: 10000,
    qYes: "5000000000000000000000",
    qNo: "3000000000000000000000",
    liquidityInitialized: true,
    creator: "0x7890123456789012345678901234567890123456",
    category: "Sports",
    chain: "ETH",
  },
  {
    id: 8,
    question: "Will SpaceX successfully land humans on Mars by 2025?",
    endTime: Date.now() + 86400000 * 365, // 365 days from now
    totalStaked: 40000,
    totalYes: 10000,
    totalNo: 30000,
    resolved: false,
    won: false,
    totalPriceToken: 45000,
    qYes: "10000000000000000000000",
    qNo: "30000000000000000000000",
    liquidityInitialized: true,
    creator: "0x8901234567890123456789012345678901234567",
    category: "Science",
    chain: "SOL",
  },
]

