Run a Lighthouse audit and fix issues:

1. Build the project: `npm run build`
2. Start production server: `npm run start`
3. Run Lighthouse CLI: `npx lighthouse http://localhost:3000 --output=json --output-path=./lighthouse-report.json`
4. Parse the JSON and identify any scores below 95
5. For each issue:
   - Explain what's causing the low score
   - Implement the fix
   - Verify the fix works
6. Re-run Lighthouse to confirm 95+ on all metrics
7. Commit: "perf: lighthouse optimizations"

Target scores:
- Performance: 95+
- Accessibility: 100
- Best Practices: 100
- SEO: 100
