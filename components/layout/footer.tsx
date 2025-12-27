'use client'

export function Footer() {
  return (
    <footer className="bg-gray-900 py-8 text-white">
      <div className="container mx-auto px-4 text-center">
        <p>&copy; {new Date().getFullYear()} PG Closets (Debug)</p>
      </div>
    </footer>
  )
}
