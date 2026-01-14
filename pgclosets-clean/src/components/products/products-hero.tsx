export function ProductsHero() {
  return (
    <section className="relative bg-white pt-16 pb-20">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-slate-50 to-white pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          {/* Badge */}
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-slate-100 text-slate-700 text-sm font-light tracking-wide mb-8">
            <span className="w-2 h-2 bg-slate-400 rounded-full mr-2"></span>
            Renin Official Dealer
          </div>

          {/* Main heading */}
          <h1 className="text-5xl lg:text-7xl font-extralight tracking-tight text-slate-900 mb-8">
            Our Complete
            <br />
            <span className="text-slate-600">Collection</span>
          </h1>

          {/* Description */}
          <p className="text-xl font-light text-slate-600 max-w-3xl mx-auto mb-12 leading-relaxed">
            Discover our full range of quality closet doors from Renin, Canada's leading door manufacturer.
            Each door is designed to enhance your home with style, functionality, and lasting quality.
          </p>

          {/* Key features */}
          <div className="flex flex-wrap justify-center items-center gap-8 text-sm font-light text-slate-500">
            <div className="flex items-center space-x-2">
              <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
              </svg>
              <span>Professional Installation</span>
            </div>
            <div className="flex items-center space-x-2">
              <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>Fast Delivery</span>
            </div>
            <div className="flex items-center space-x-2">
              <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>Quality Guarantee</span>
            </div>
          </div>
        </div>
      </div>

      {/* Decorative bottom border */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-slate-200 to-transparent" />
    </section>
  );
}