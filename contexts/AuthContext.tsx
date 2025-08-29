"use client"
import { createContext, useContext, useReducer, useEffect, type ReactNode } from "react"
import type { User } from "@/lib/types"

interface AuthState {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
}

type AuthAction =
  | { type: "LOGIN_START" }
  | { type: "LOGIN_SUCCESS"; payload: User }
  | { type: "LOGIN_FAILURE" }
  | { type: "LOGOUT" }
  | { type: "UPDATE_USER"; payload: Partial<User> }
  | { type: "LOAD_USER"; payload: User | null }

function authReducer(state: AuthState, action: AuthAction): AuthState {
  switch (action.type) {
    case "LOGIN_START":
      return { ...state, isLoading: true }

    case "LOGIN_SUCCESS":
      return {
        ...state,
        user: action.payload,
        isAuthenticated: true,
        isLoading: false,
      }

    case "LOGIN_FAILURE":
      return {
        ...state,
        user: null,
        isAuthenticated: false,
        isLoading: false,
      }

    case "LOGOUT":
      return {
        ...state,
        user: null,
        isAuthenticated: false,
        isLoading: false,
      }

    case "UPDATE_USER":
      return {
        ...state,
        user: state.user ? { ...state.user, ...action.payload } : null,
      }

    case "LOAD_USER":
      return {
        ...state,
        user: action.payload,
        isAuthenticated: !!action.payload,
        isLoading: false,
      }

    default:
      return state
  }
}

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  isLoading: true,
}

interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<boolean>
  register: (email: string, password: string, name: string) => Promise<boolean>
  logout: () => void
  updateUser: (updates: Partial<User>) => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

const mockUsers: User[] = []

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(authReducer, initialState)

  // Load user from localStorage on mount
  useEffect(() => {
    const savedUser = localStorage.getItem("pg-closets-user")
    if (savedUser) {
      try {
        const user = JSON.parse(savedUser)
        dispatch({ type: "LOAD_USER", payload: user })
      } catch (error) {
        console.error("Failed to load user from localStorage:", error)
        dispatch({ type: "LOAD_USER", payload: null })
      }
    } else {
      dispatch({ type: "LOAD_USER", payload: null })
    }
  }, [])

  // Save user to localStorage whenever it changes
  useEffect(() => {
    if (state.user) {
      localStorage.setItem("pg-closets-user", JSON.stringify(state.user))
    } else {
      localStorage.removeItem("pg-closets-user")
    }
  }, [state.user])

  const login = async (email: string, password: string): Promise<boolean> => {
    dispatch({ type: "LOGIN_START" })

    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 1000))

    dispatch({ type: "LOGIN_FAILURE" })
    return false
  }

  const register = async (email: string, password: string, name: string): Promise<boolean> => {
    dispatch({ type: "LOGIN_START" })

    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 1000))

    dispatch({ type: "LOGIN_FAILURE" })
    return false
  }

  const logout = () => {
    dispatch({ type: "LOGOUT" })
  }

  const updateUser = (updates: Partial<User>) => {
    dispatch({ type: "UPDATE_USER", payload: updates })
  }

  return (
    <AuthContext.Provider
      value={{
        ...state,
        login,
        register,
        logout,
        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
