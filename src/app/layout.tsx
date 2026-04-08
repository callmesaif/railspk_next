import './globals.css'
import Navbar from './components/Navbar'

export const metadata = {
  title: 'RAILSPK | Digital Legacy Project',
  description: 'Documenting the Digital Legacy of Pakistan Railways - A Journey Through Time and Technology.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="bg-gray-50 text-gray-900">
        <Navbar />
        <main className="min-h-screen">{children}</main>
        <footer className="bg-blue-900 text-white p-6 text-center mt-10">
          <p>© 2026 RAILSPK - All Rights Reserved</p>
        </footer>
      </body>
    </html>
  )
}