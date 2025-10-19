Operations Playbook — PG Closets

Scope
- Asset CDN fixes, Vercel MCP + AI SDK endpoints, quick validation.

Environment
- Required env: OPENAI_API_KEY
- Optional: NEXT_PUBLIC_MCP_SSE_URL (defaults to /api/mcp/mcp)

Primary endpoints
- MCP (HTTP/SSE base): /api/mcp
- MCP SSE endpoint: /api/mcp/mcp
- MCP tools (examples):
  - ping
  - get_product_images { slug }
  - product_meta_by_slug { slug }
  - asset_check { path }
  - vercel_cache_guidance
// AI Chat temporarily disabled

Admin pages
- /admin/mcp — test MCP tools via server-side client
- /admin/ai — test AI chat that can call MCP tools

Asset 404 recovery
1) Vercel Dashboard → Project → Settings → Domains → Purge Cache
   - Purge paths: /images/products/* and /images/services/*
2) Redeploy from latest
3) Spot-check 200s:
   - /images/products/barn-door-main.jpg
   - /images/services/installation-hero.jpg

Why this fixes it
- vercel.json sets Cache-Control: no-store on /404 to prevent sticky, year-long cached 404 responses.
- Purge removes stale 404s and rehydrates from the new deploy that includes assets.

Health checks
- GET /api/mcp/HTTP (handshake via MCP client)
- GET /api/mcp/test?slug=barn-classic (server MCP client test)
// AI Chat disabled; use /admin/mcp and /admin/assets for validation

Troubleshooting
- 404s persist: ensure purge + redeploy completed; check region cache; confirm assets exist in repo and are under public/images/**.
- AI route 500: ensure OPENAI_API_KEY set; check model availability.
- MCP client connection: ensure SSE URL matches NEXT_PUBLIC_MCP_SSE_URL if customized.
