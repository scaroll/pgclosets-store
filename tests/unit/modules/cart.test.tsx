import { useCartStore } from '@/lib/stores/cart-store'
import { act, renderHook } from '@testing-library/react'
import { beforeEach, describe, expect, it } from 'vitest'

describe('CartStore', () => {
  beforeEach(() => {
    const { result } = renderHook(() => useCartStore())
    act(() => {
      result.current.clearCart()
      result.current.closeCart()
    })
  })

  it('should start empty', () => {
    const { result } = renderHook(() => useCartStore())
    expect(result.current.items).toEqual([])
    expect(result.current.isOpen).toBe(false)
    expect(result.current.totalItems()).toBe(0)
    expect(result.current.totalPrice()).toBe(0)
  })

  it('should add items', () => {
    const { result } = renderHook(() => useCartStore())

    act(() => {
      result.current.addItem({
        productId: 'p1',
        name: 'Product 1',
        price: 100,
        quantity: 1,
      })
    })

    expect(result.current?.items).toHaveLength(1)
    expect(result.current?.items[0]?.name).toBe('Product 1')
    expect(result.current?.totalItems()).toBe(1)
    expect(result.current?.totalPrice()).toBe(100)
    expect(result.current?.isOpen).toBe(true) // Should open cart on add
  })

  it('should stack existing items', () => {
    const { result } = renderHook(() => useCartStore())

    act(() => {
      result.current.addItem({
        productId: 'p1',
        name: 'Product 1',
        price: 100,
        quantity: 1,
      })
    })

    act(() => {
      result.current.addItem({
        productId: 'p1',
        name: 'Product 1',
        price: 100,
        quantity: 2,
      })
    })

    expect(result.current?.items).toHaveLength(1)
    expect(result.current?.items[0]?.quantity).toBe(3)
    expect(result.current?.totalItems()).toBe(3)
    expect(result.current?.totalPrice()).toBe(300)
  })

  it('should separate different variants', () => {
    const { result } = renderHook(() => useCartStore())

    act(() => {
      result.current?.addItem({
        productId: 'p1',
        variantId: 'v1',
        name: 'Product 1',
        price: 100,
        quantity: 1,
      })
    })

    act(() => {
      result.current?.addItem({
        productId: 'p1',
        variantId: 'v2',
        name: 'Product 1',
        price: 100,
        quantity: 1,
      })
    })

    expect(result.current?.items).toHaveLength(2)
  })

  it('should remove items', () => {
    const { result } = renderHook(() => useCartStore())

    act(() => {
      result.current?.addItem({
        productId: 'p1',
        name: 'Product 1',
        price: 100,
        quantity: 1,
      })
    })

    const itemId = result.current?.items?.[0]?.id

    act(() => {
      result.current?.removeItem(itemId as string)
    })

    expect(result.current?.items).toEqual([])
  })

  it('should update quantity', () => {
    const { result } = renderHook(() => useCartStore())

    act(() => {
      result.current?.addItem({
        productId: 'p1',
        name: 'Product 1',
        price: 100,
        quantity: 1,
      })
    })

    const itemId = result.current?.items?.[0]?.id

    act(() => {
      result.current?.updateQuantity(itemId as string, 5)
    })

    expect(result.current?.items[0]?.quantity).toBe(5)
    expect(result.current?.totalItems()).toBe(5)
  })

  it('should remove item if quantity updated to 0', () => {
    const { result } = renderHook(() => useCartStore())

    act(() => {
      result.current?.addItem({
        productId: 'p1',
        name: 'Product 1',
        price: 100,
        quantity: 1,
      })
    })

    const itemId = result.current?.items?.[0]?.id

    act(() => {
      result.current?.updateQuantity(itemId as string, 0)
    })

    expect(result.current?.items).toEqual([])
  })
})
