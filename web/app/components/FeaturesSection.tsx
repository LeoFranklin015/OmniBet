import { Zap, Globe, Lock, Coins } from "lucide-react"

export default function FeaturesSection() {
  const features = [
    {
      icon: <Zap className="w-8 h-8 mb-4" />,
      title: "LMSR Strategy",
      description: "Logarithmic Market Scoring Rule provides efficient price discovery and liquidity for all markets.",
    },
    {
      icon: <Globe className="w-8 h-8 mb-4" />,
      title: "Multichain",
      description: "Bet on any chain with Reactive Network as our chain aggregator. One platform, all chains.",
    },
    {
      icon: <Lock className="w-8 h-8 mb-4" />,
      title: "Secure & Transparent",
      description: "All markets are secured by smart contracts with transparent resolution mechanisms.",
    },
    {
      icon: <Coins className="w-8 h-8 mb-4" />,
      title: "Automated Market Maker",
      description: "Our AMM ensures there's always liquidity for your bets, no counterparty needed.",
    },
  ]

  return (
    <section className="py-8">
      <h2 className="text-2xl font-pixel mb-8 text-center">Why OmniBets?</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {features.map((feature, index) => (
          <div
            key={index}
            className="p-6 bg-gray-800 rounded-lg pixelated-border flex flex-col items-center text-center"
          >
            {feature.icon}
            <h3 className="text-lg font-pixel mb-2">{feature.title}</h3>
            <p className="font-mono">{feature.description}</p>
          </div>
        ))}
      </div>
    </section>
  )
}

