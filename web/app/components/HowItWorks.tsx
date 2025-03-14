export default function HowItWorks() {
  const steps = [
    {
      number: "01",
      title: "Choose a Market",
      description: "Browse through our prediction markets across multiple chains.",
    },
    {
      number: "02",
      title: "Place Your Bet",
      description: "Bet YES or NO on the outcome with any supported token.",
    },
    {
      number: "03",
      title: "Wait for Resolution",
      description: "Markets are resolved when the event concludes.",
    },
    {
      number: "04",
      title: "Collect Winnings",
      description: "If your prediction was correct, claim your rewards!",
    },
  ]

  return (
    <section id="how-it-works" className="py-8">
      <h2 className="text-2xl font-pixel mb-8 text-center">How It Works</h2>

      <div className="relative">
        <div className="absolute left-1/2 top-0 bottom-0 w-0.5 bg-green-400 hidden md:block"></div>

        <div className="space-y-12">
          {steps.map((step, index) => (
            <div key={index} className="relative">
              <div className={`md:w-1/2 ${index % 2 === 0 ? "md:pr-12 md:ml-0" : "md:pl-12 md:ml-auto"}`}>
                <div className="p-6 bg-gray-800 rounded-lg pixelated-border">
                  <div className="font-pixel text-4xl text-green-400 mb-4">{step.number}</div>
                  <h3 className="text-lg font-pixel mb-2">{step.title}</h3>
                  <p className="font-mono">{step.description}</p>
                </div>
              </div>

              <div className="absolute top-6 left-1/2 transform -translate-x-1/2 w-6 h-6 bg-green-400 rounded-full hidden md:block"></div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

