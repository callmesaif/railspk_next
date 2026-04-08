import Link from 'next/link'

export default function Navbar() {
  return (
    <nav className="bg-blue-900 text-white p-4 shadow-lg sticky top-0 z-50">
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/" className="text-2xl font-bold tracking-wider">
          RAILS<span className="text-yellow-400">PK</span>
        </Link>
        <div className="space-x-6 font-medium">
          <Link href="/" className="hover:text-yellow-400 transition">Home</Link>
          <Link href="/community" className="hover:text-yellow-400 transition">Community</Link>
          <Link href="/journeys" className="hover:text-yellow-400 transition">Journeys</Link>
        </div>
      </div>
    </nav>
  )
}