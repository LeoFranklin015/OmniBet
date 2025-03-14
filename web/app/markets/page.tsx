import { markets } from "../data/markets";
import MarketPreview from "../components/MarketPreview";

export default function MarketsPage() {
  // Group markets by category
  const categories = Array.from(
    new Set(markets.map((market) => market.category ?? ""))
  );

  return (
    <div>
      <h1 className="text-3xl font-pixel mb-6">Prediction Markets</h1>

      <div className="mt-8 space-y-12">
        {categories.map((category) => (
          <section key={category} className="mb-8">
            <h2 className="text-xl font-pixel mb-4">{category}</h2>
            <div className="grid gap-6">
              {markets
                .filter((market) => market.category === category)
                .map((market) => (
                  <MarketPreview key={market.id} market={market} />
                ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
