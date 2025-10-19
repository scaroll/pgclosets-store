import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  const form = await req.formData()
  const provided = String(form.get('key') || '')
  const next = String(form.get('next') || '/admin')
  const expected = process.env.ADMIN_DASHBOARD_KEY || ''

  if (!expected) {
    return NextResponse.json(
      { error: 'ADMIN_DASHBOARD_KEY not configured' },
      { status: 500 },
    )
  }

  if (provided !== expected) {
    return NextResponse.json({ error: 'Invalid admin key' }, { status: 401 })
  }

  const res = NextResponse.redirect(new URL(next, req.url))
  res.cookies.set('pg_admin', '1', {
    httpOnly: true,
    sameSite: 'lax',
    secure: true,
    path: '/',
    maxAge: 60 * 60 * 24 * 7,
  })
  return res
}

