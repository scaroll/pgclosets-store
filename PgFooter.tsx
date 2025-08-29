export default function PgFooter() {
  return (
    <footer className="border-t border-pg-border">
      <div className="container-apple py-6 text-body-s text-pg-gray flex flex-col md:flex-row items-center justify-between gap-3">
        <div>© {new Date().getFullYear()} PG Closets</div>
        <nav className="flex gap-4">
          <a href="/legal/privacy" className="hover:text-pg-navy transition-colors duration-200">
            Privacy
          </a>
          <a href="/legal/terms" className="hover:text-pg-navy transition-colors duration-200">
            Terms
          </a>
          <a href="mailto:spencer@peoplesgrp.com" className="hover:text-pg-navy transition-colors duration-200">
            spencer@peoplesgrp.com
          </a>
          <a href="/contact" className="hover:text-pg-navy transition-colors duration-200">
            Request Work
          </a>
        </nav>
      </div>
    </footer>
  )
}
