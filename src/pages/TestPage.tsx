import AnimatedCityBackground from "../components/ui/AnimatedCityBackground"

export default function HeroWithCityBackground() {
  return (
    <section className="relative min-h-screen bg-[#f3f5ee] text-black overflow-hidden">
      <AnimatedCityBackground />

      <div className="relative z-10 mx-auto max-w-6xl px-6 py-24 md:px-10 md:py-32">
        <div className="max-w-3xl">
          <p className="mb-4 text-sm uppercase tracking-[0.22em] text-black/60">
            Intelligent Mobility
          </p>

          <h1 className="text-5xl font-semibold leading-tight md:text-7xl">
            Move through the city with a smarter network.
          </h1>

          <p className="mt-6 max-w-2xl text-base text-black/70 md:text-lg">
            This text stays on top while the React Three Fiber city animates behind it.
          </p>

          <div className="mt-8 flex flex-wrap gap-4">
            <button className="rounded-full bg-black px-6 py-3 text-white transition hover:opacity-90">
              Get Started
            </button>
            <button className="rounded-full border border-black/20 bg-white/70 px-6 py-3 text-black backdrop-blur-sm transition hover:bg-white">
              Learn More
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}