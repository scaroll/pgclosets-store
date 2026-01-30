import { type NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { z } from 'zod'

export const maxDuration = 30

// Type definitions
type AddressType = 'shipping' | 'billing'
interface AddressInput {
  type: AddressType
  firstName: string
  lastName: string
  company?: string
  address1: string
  address2?: string
  city: string
  province: string
  postalCode: string
  country?: string
  phone?: string
  isDefault?: boolean
}
const createAddressSchema = z.object({
  type: z.enum(['shipping', 'billing']),
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  company: z.string().optional(),
  address1: z.string().min(1, 'Address is required'),
  address2: z.string().optional(),
  city: z.string().min(1, 'City is required'),
  province: z.string().min(2, 'Province is required'),
  postalCode: z.string().min(6, 'Valid postal code is required'),
  country: z.string().default('CA'),
  phone: z.string().optional(),
  isDefault: z.boolean().default(false),
}) as z.ZodType<AddressInput>
// GET /api/user/addresses - Get user addresses
export async function GET(_req: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 })
    }
    const addresses = await prisma.address.findMany({
      where: { userId: session.user.id },
      orderBy: { isDefault: 'desc' },
    })
    return NextResponse.json(addresses)
  } catch (error) {
    console.error('[ADDRESSES_GET_ERROR]', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
// POST /api/user/addresses - Create new address
export async function POST(req: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 })
    }
    const body = await req.json()
    const validated = createAddressSchema.safeParse(body)
    if (!validated.success) {
      return NextResponse.json(
        { error: 'Invalid input', details: validated.error.errors },
        { status: 400 }
      )
    }
    const { isDefault, ...addressData } = validated.data
    // If setting as default, unset other default addresses of the same type
    if (isDefault) {
      await prisma.address.updateMany({
        where: {
          userId: session.user.id,
          type: addressData.type,
          isDefault: true,
        },
        data: { isDefault: false },
      })
    }
    const address = await prisma.address.create({
      data: {
        ...addressData,
        userId: session.user.id,
        isDefault,
      },
    })
    return NextResponse.json({
      success: true,
      address,
      message: 'Address created successfully',
    })
  } catch (error) {
    console.error('[ADDRESS_CREATE_ERROR]', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
