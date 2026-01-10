import { NextResponse } from "next/server"

export function POST(req: Request) {
  const bodyPromise = req.json().catch(() => ({}))
  return bodyPromise.then(body =>
    NextResponse.json({ ok: true, received: body })
  )
}
