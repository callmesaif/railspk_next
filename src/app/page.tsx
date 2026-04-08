import Hero from './components/Hero'
import Reviews from './components/Reviews'
import Feed from './components/Feed'
import AboutSupport from './components/AboutSupport'

export default function Home() {
  return (
    <main className="min-h-screen bg-white">
      {/* 1. Hero / Highlights */}
      <Hero />

      {/* 2. Train Reviews Section */}
      <Reviews />

      {/* 3. Community Feed & Vlogs */}
      <Feed />

      {/* 4. Support & About Section */}
      <AboutSupport />
    </main>
  )
}