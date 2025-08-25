import { medusaClient, HttpTypes } from "./config"

const CART_COOKIE_NAME = "medusa_cart_id"

/**
 * Get cart ID from cookies (client-side)
 */
function getCartId(): string | null {
  if (typeof window === "undefined") return null
  
  const value = `; ${document.cookie}`
  const parts = value.split(`; ${CART_COOKIE_NAME}=`)
  if (parts.length === 2) {
    return parts.pop()?.split(';').shift() || null
  }
  return null
}

/**
 * Set cart ID in cookies (client-side)
 */
function setCartId(cartId: string): void {
  if (typeof window === "undefined") return
  
  const maxAge = 60 * 60 * 24 * 7 // 7 days
  const secure = process.env.NODE_ENV === "production" ? "; Secure" : ""
  document.cookie = `${CART_COOKIE_NAME}=${cartId}; Max-Age=${maxAge}; Path=/; SameSite=Strict${secure}`
}

/**
 * Create a new cart
 */
export async function createCart(regionId?: string): Promise<HttpTypes.StoreCart> {
  try {
    const response = await medusaClient.store.cart.create({
      region_id: regionId,
    })
    
    if (response.cart?.id) {
      setCartId(response.cart.id)
    }
    
    return response.cart
  } catch (error) {
    console.error("Error creating cart:", error)
    throw error
  }
}

/**
 * Get or create cart
 */
export async function getOrCreateCart(regionId?: string): Promise<HttpTypes.StoreCart> {
  const cartId = getCartId()
  
  if (cartId) {
    try {
      const response = await medusaClient.store.cart.retrieve(cartId)
      return response.cart
    } catch (error) {
      console.warn("Cart not found, creating new one:", error)
    }
  }
  
  return createCart(regionId)
}

/**
 * Get cart by ID
 */
export async function getCart(cartId?: string): Promise<HttpTypes.StoreCart | null> {
  if (!cartId) {
    cartId = getCartId()
  }
  
  if (!cartId) {
    return null
  }
  
  try {
    const response = await medusaClient.store.cart.retrieve(cartId)
    return response.cart
  } catch (error) {
    console.error("Error fetching cart:", error)
    return null
  }
}

/**
 * Add item to cart
 */
export async function addToCart(
  variantId: string,
  quantity: number = 1,
  cartId?: string
): Promise<HttpTypes.StoreCart> {
  if (!cartId) {
    cartId = getCartId()
  }
  
  if (!cartId) {
    const cart = await createCart()
    cartId = cart.id
  }
  
  try {
    const response = await medusaClient.store.cart.createLineItem(cartId, {
      variant_id: variantId,
      quantity,
    })
    return response.cart
  } catch (error) {
    console.error("Error adding item to cart:", error)
    throw error
  }
}

/**
 * Update cart item quantity
 */
export async function updateCartItem(
  lineItemId: string,
  quantity: number,
  cartId?: string
): Promise<HttpTypes.StoreCart> {
  if (!cartId) {
    cartId = getCartId()
  }
  
  if (!cartId) {
    throw new Error("No cart found")
  }
  
  try {
    const response = await medusaClient.store.cart.updateLineItem(
      cartId,
      lineItemId,
      { quantity }
    )
    return response.cart
  } catch (error) {
    console.error("Error updating cart item:", error)
    throw error
  }
}

/**
 * Remove item from cart
 */
export async function removeFromCart(
  lineItemId: string,
  cartId?: string
): Promise<HttpTypes.StoreCart> {
  if (!cartId) {
    cartId = getCartId()
  }
  
  if (!cartId) {
    throw new Error("No cart found")
  }
  
  try {
    await medusaClient.store.cart.deleteLineItem(cartId, lineItemId)
    // Refetch the cart after deletion
    const updatedCart = await getCart(cartId)
    return updatedCart as HttpTypes.StoreCart
  } catch (error) {
    console.error("Error removing item from cart:", error)
    throw error
  }
}

/**
 * Complete cart (create order)
 */
export async function completeCart(cartId?: string): Promise<any> {
  if (!cartId) {
    cartId = getCartId()
  }
  
  if (!cartId) {
    throw new Error("No cart found")
  }
  
  try {
    const response = await medusaClient.store.cart.complete(cartId)
    
    // Clear cart cookie after successful completion
    if (typeof window !== "undefined") {
      document.cookie = `${CART_COOKIE_NAME}=; Max-Age=0; Path=/`
    }
    
    return response
  } catch (error) {
    console.error("Error completing cart:", error)
    throw error
  }
}