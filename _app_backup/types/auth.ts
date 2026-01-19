/**
 * Authentication and User Type Definitions
 */

export interface User {
  id: string
  email: string
  name: string
  phone?: string
  address?: UserAddress
}

export interface UserAddress {
  street: string
  city: string
  province: string
  postalCode: string
  country: string
}

export interface AuthSession {
  user: User | null
  isAuthenticated: boolean
  accessToken?: string
  expiresAt?: number
}

export interface LoginCredentials {
  email: string
  password: string
}

export interface RegisterData extends LoginCredentials {
  name: string
  phone?: string
}
