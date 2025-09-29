import Link from "next/link";
import { PGLogo } from "@/ui/pg-logo";

export default function PgFooter() {
  return (
    <footer className="bg-gradient-to-b from-slate-900 to-black text-white relative overflow-hidden">

      {/* Subtle background pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-0 left-0 w-96 h-96 bg-amber-400 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-slate-400 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          <div className="space-y-4">
            {/* Footer Logo */}
            <Link href="/" className="flex items-center gap-3 mb-6">
              <PGLogo
                width={48}
                height={48}
                withWordmark={false}
                className="text-white"
              />
              <div className="flex flex-col">
                <h3 className="text-2xl font-extralight tracking-tight bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">
                  PG CLOSETS
                </h3>
                <span className="text-xs text-amber-400/60 font-medium uppercase tracking-widest">Quality Closets for Ottawa</span>
              </div>
            </Link>
            <p className="text-slate-400 font-light text-sm tracking-wide leading-relaxed">
              Ottawa's closet door specialists, transforming homes with
              quality solutions since 2010.
            </p>
            <div className="flex gap-4 pt-4">
              {/* Social Media Icons with hover effects */}
              <a
                href="#"
                className="text-slate-400 hover:text-white transition-all duration-300 hover:scale-110"
                aria-label="Facebook"
              >
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
              </a>
              <a
                href="#"
                className="text-slate-400 hover:text-white transition-all duration-300 hover:scale-110"
                aria-label="Instagram"
              >
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zM5.838 12a6.162 6.162 0 1112.324 0 6.162 6.162 0 01-12.324 0zM12 16a4 4 0 110-8 4 4 0 010 8zm4.965-10.405a1.44 1.44 0 112.881.001 1.44 1.44 0 01-2.881-.001z" />
                </svg>
              </a>
              <a
                href="#"
                className="text-slate-400 hover:text-white transition-all duration-300 hover:scale-110"
                aria-label="LinkedIn"
              >
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                </svg>
              </a>
            </div>
          </div>

          <div>
            <h4 className="text-sm font-light uppercase tracking-[0.3em] mb-6 text-slate-500">
              Quick Links
            </h4>
            <div className="space-y-3">
              <Link
                href="/"
                className="block text-slate-300 font-light hover:text-white transition-all duration-300 hover:translate-x-1 flex items-center gap-2 group"
              >
                <span className="text-slate-500 group-hover:text-amber-400 transition-colors">
                  →
                </span>{" "}
                Home
              </Link>
              <Link
                href="/products"
                className="block text-slate-300 font-light hover:text-white transition-all duration-300 hover:translate-x-1 flex items-center gap-2 group"
              >
                <span className="text-slate-500 group-hover:text-amber-400 transition-colors">
                  →
                </span>{" "}
                Products
              </Link>
              <Link
                href="/services"
                className="block text-slate-300 font-light hover:text-white transition-all duration-300 hover:translate-x-1 flex items-center gap-2 group"
              >
                <span className="text-slate-500 group-hover:text-amber-400 transition-colors">
                  →
                </span>{" "}
                Services
              </Link>
              <Link
                href="/about"
                className="block text-slate-300 font-light hover:text-white transition-all duration-300 hover:translate-x-1 flex items-center gap-2 group"
              >
                <span className="text-slate-500 group-hover:text-amber-400 transition-colors">
                  →
                </span>{" "}
                About
              </Link>
              <Link
                href="/gallery"
                className="block text-slate-300 font-light hover:text-white transition-all duration-300 hover:translate-x-1 flex items-center gap-2 group"
              >
                <span className="text-slate-500 group-hover:text-amber-400 transition-colors">
                  →
                </span>{" "}
                Gallery
              </Link>
              <Link
                href="/contact"
                className="block text-slate-300 font-light hover:text-white transition-all duration-300 hover:translate-x-1 flex items-center gap-2 group"
              >
                <span className="text-slate-500 group-hover:text-amber-400 transition-colors">
                  →
                </span>{" "}
                Contact
              </Link>
            </div>
          </div>

          <div>
            <h4 className="text-sm font-light uppercase tracking-[0.3em] mb-6 text-slate-500">
              Get In Touch
            </h4>
            <div className="space-y-4 text-slate-300 font-light text-sm">
              <div className="flex items-center gap-3">
                <svg
                  className="w-5 h-5 text-slate-500"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
                <a
                  href="mailto:info@pgclosets.com"
                  className="hover:text-white transition-colors duration-300"
                >
                  info@pgclosets.com
                </a>
              </div>
              <div className="flex items-center gap-3">
                <svg
                  className="w-5 h-5 text-slate-500"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
                <span>Ottawa & Surrounding Areas</span>
              </div>
              <div className="flex items-center gap-3">
                <svg
                  className="w-5 h-5 text-slate-500"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <div>
                  <div className="text-xs uppercase tracking-wider text-slate-500 mb-1">
                    Business Hours
                  </div>
                  <div>Mon-Fri: 8AM - 6PM</div>
                  <div>Sat: 9AM - 4PM</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-slate-800/50 pt-8 flex flex-col md:flex-row items-center justify-between">
          <div className="flex items-center gap-4">
            {/* Footer signature logo */}
            <ResponsiveLogoVariants
              variant="compact"
              theme="dark"
              width={32}
              height={6}
              className="opacity-60"
            />
            <div className="text-slate-500 font-light text-sm tracking-wide">
              © {new Date().getFullYear()} PG Closets. Luxury solutions for
              discerning homeowners.
            </div>
          </div>
          <nav className="flex gap-8 mt-4 md:mt-0">
            <Link
              href="/privacy-policy"
              className="text-slate-500 font-light text-sm tracking-wide hover:text-white transition-all duration-300 relative group"
            >
              Privacy Policy
              <span className="absolute bottom-0 left-0 w-0 h-[1px] bg-white group-hover:w-full transition-all duration-300" />
            </Link>
            <Link
              href="/terms-of-service"
              className="text-slate-500 font-light text-sm tracking-wide hover:text-white transition-all duration-300 relative group"
            >
              Terms of Service
              <span className="absolute bottom-0 left-0 w-0 h-[1px] bg-white group-hover:w-full transition-all duration-300" />
            </Link>
            <Link
              href="/request-work"
              className="text-amber-400 font-light text-sm tracking-wide hover:text-amber-300 transition-all duration-300 relative group"
            >
              Request Consultation
              <span className="absolute bottom-0 left-0 w-0 h-[1px] bg-amber-400 group-hover:w-full transition-all duration-300" />
            </Link>
          </nav>
        </div>
      </div>
    </footer>
  );
}
