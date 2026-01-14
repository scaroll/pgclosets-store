// About page placeholder with slate styling
export default function About() {
  return (
    <div className="min-h-screen bg-slate-50 py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h1 className="text-5xl lg:text-6xl font-extralight tracking-tight text-slate-900 mb-8">
            About PG Closets
          </h1>
          <p className="text-xl font-light text-slate-600 max-w-2xl mx-auto">
            Family-owned & proud since 2010, serving Ottawa with beautiful closet doors and friendly service.
          </p>
        </div>
        <div className="bg-white p-12 rounded-lg shadow-sm border border-slate-200">
          <p className="text-lg text-slate-700 text-center">
            Our story and team information coming soon!
          </p>
        </div>
      </div>
    </div>
  )
}