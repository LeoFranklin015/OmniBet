import Link from "next/link";
import HeroSection from "./components/HeroSection";
import FeaturesSection from "./components/FeaturesSection";
import HowItWorks from "./components/HowItWorks";
import MarketPreview from "./components/MarketPreview";
import { markets } from "./data/markets";

export default function Home() {
  // Get top 3 markets by total staked
  const topMarkets = [...markets]
    .sort((a, b) => b.totalStaked - a.totalStaked)
    .slice(0, 3);

  return (
    <div className="space-y-16">
      <HeroSection />
      <FeaturesSection />
      <HowItWorks />

      <section className="py-8">
        <h2 className="text-2xl font-pixel mb-6">Popular Markets</h2>
        <div className="grid gap-6">
          {topMarkets.map((market) => (
            <MarketPreview key={market.id} market={market} />
          ))}
        </div>
        <div className="mt-8 text-center">
          <Link
            href="/markets"
            className="inline-block px-6 py-3 bg-green-600 text-black font-pixel rounded pixelated-border hover:bg-green-500 transition-colors"
          >
            View All Markets
          </Link>
        </div>
      </section>
    </div>
  );
}
