import {
  type RenderOptions,
  render,
  type ReactElement
} from '@testing-library/react'
import React from 'react'

const AllTheProviders = ({ children }: { children: React.ReactNode }) => {
  return <>{children}</>
}

const customRender = (ui: ReactElement, options?: Omit<RenderOptions, 'wrapper'>) =>
  render(ui, { wrapper: AllTheProviders, ...options })

// Re-export everything except render which we override
export type * from '@testing-library/react'
export { screen, waitFor, fireEvent } from '@testing-library/react'
export { customRender as render }
