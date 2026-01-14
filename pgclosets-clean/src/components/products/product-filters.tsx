"use client";

interface ProductFiltersProps {
  categories: string[];
  activeCategory: string;
  onCategoryChange: (category: string) => void;
  searchTerm: string;
  onSearchChange: (term: string) => void;
  totalProducts: number;
}

export function ProductFilters({
  categories,
  activeCategory,
  onCategoryChange,
  searchTerm,
  onSearchChange,
  totalProducts,
}: ProductFiltersProps) {
  return (
    <div className="mb-12">
      {/* Search and results count */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 mb-8">
        {/* Search bar */}
        <div className="relative max-w-md">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg className="h-5 w-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <input
            type="text"
            placeholder="Search doors..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-slate-900 focus:border-slate-900 font-light transition-colors"
          />
          {searchTerm && (
            <button
              onClick={() => onSearchChange("")}
              className="absolute inset-y-0 right-0 pr-3 flex items-center"
              aria-label="Clear search"
            >
              <svg className="h-5 w-5 text-slate-400 hover:text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>

        {/* Results count */}
        <div className="text-slate-600 font-light">
          {totalProducts === 1 ? "1 door" : `${totalProducts} doors`} found
        </div>
      </div>

      {/* Category filters */}
      <div className="flex flex-wrap gap-3">
        <button
          onClick={() => onCategoryChange("all")}
          className={`px-6 py-2 rounded-full font-light transition-all duration-200 ${
            activeCategory === "all"
              ? "bg-slate-900 text-white"
              : "bg-slate-100 text-slate-700 hover:bg-slate-200"
          }`}
        >
          All Doors
        </button>

        {categories.map((category) => (
          <button
            key={category}
            onClick={() => onCategoryChange(category)}
            className={`px-6 py-2 rounded-full font-light transition-all duration-200 ${
              activeCategory.toLowerCase() === category.toLowerCase()
                ? "bg-slate-900 text-white"
                : "bg-slate-100 text-slate-700 hover:bg-slate-200"
            }`}
          >
            {category}
          </button>
        ))}
      </div>

      {/* Active filters summary */}
      {(activeCategory !== "all" || searchTerm) && (
        <div className="mt-6 flex flex-wrap items-center gap-3">
          <span className="text-sm text-slate-600 font-light">Active filters:</span>

          {activeCategory !== "all" && (
            <div className="inline-flex items-center px-3 py-1 rounded-full bg-slate-900 text-white text-sm">
              <span>{activeCategory}</span>
              <button
                onClick={() => onCategoryChange("all")}
                className="ml-2 hover:text-slate-300"
                aria-label={`Remove ${activeCategory} filter`}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          )}

          {searchTerm && (
            <div className="inline-flex items-center px-3 py-1 rounded-full bg-slate-900 text-white text-sm">
              <span>"{searchTerm}"</span>
              <button
                onClick={() => onSearchChange("")}
                className="ml-2 hover:text-slate-300"
                aria-label="Remove search filter"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          )}

          <button
            onClick={() => {
              onCategoryChange("all");
              onSearchChange("");
            }}
            className="text-sm text-slate-500 hover:text-slate-700 font-light underline"
          >
            Clear all
          </button>
        </div>
      )}
    </div>
  );
}