'use server'

import { verifyAdmin, createAdminSession } from '@/lib/auth/admin'
import { redirect } from 'next/navigation'

interface LoginState {
  error: string | null
}

export async function loginAction(
  _prevState: LoginState,
  formData: FormData
): Promise<LoginState> {
  const password = formData.get('password') as string

  if (!password || typeof password !== 'string') {
    return { error: 'Password is required' }
  }

  const isValid = await verifyAdmin(password)

  if (!isValid) {
    return { error: 'Invalid password' }
  }

  // Create session and redirect
  await createAdminSession()
  redirect('/admin')
}
