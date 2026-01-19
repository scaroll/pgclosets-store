import { create } from 'zustand'

export type DoorType = 'barn' | 'bifold' | 'bypass' | 'glass'
export type SizeType = 'standard' | 'custom'
export type Material = 'pine' | 'oak' | 'walnut' | 'frosted-glass' | 'clear-glass'
export type Hardware = 'basic' | 'premium' | 'luxury'

export interface EstimatorState {
  // Form state
  step: number
  doorType: DoorType | null
  sizeType: SizeType | null
  customWidth: string
  customHeight: string
  material: Material | null
  hardware: Hardware | null
  installation: boolean | null

  // Contact form
  name: string
  email: string
  phone: string
  message: string

  // Actions
  setStep: (step: number) => void
  setDoorType: (doorType: DoorType) => void
  setSizeType: (sizeType: SizeType) => void
  setCustomWidth: (width: string) => void
  setCustomHeight: (height: string) => void
  setMaterial: (material: Material) => void
  setHardware: (hardware: Hardware) => void
  setInstallation: (installation: boolean) => void
  setName: (name: string) => void
  setEmail: (email: string) => void
  setPhone: (phone: string) => void
  setMessage: (message: string) => void
  nextStep: () => void
  prevStep: () => void
  reset: () => void
  calculateEstimate: () => { min: number; max: number }
}

const initialState = {
  step: 1,
  doorType: null,
  sizeType: null,
  customWidth: '',
  customHeight: '',
  material: null,
  hardware: null,
  installation: null,
  name: '',
  email: '',
  phone: '',
  message: '',
}

export const useEstimatorStore = create<EstimatorState>((set, get) => ({
  ...initialState,

  setStep: (step) => set({ step }),
  setDoorType: (doorType) => set({ doorType }),
  setSizeType: (sizeType) => set({ sizeType }),
  setCustomWidth: (customWidth) => set({ customWidth }),
  setCustomHeight: (customHeight) => set({ customHeight }),
  setMaterial: (material) => set({ material }),
  setHardware: (hardware) => set({ hardware }),
  setInstallation: (installation) => set({ installation }),
  setName: (name) => set({ name }),
  setEmail: (email) => set({ email }),
  setPhone: (phone) => set({ phone }),
  setMessage: (message) => set({ message }),

  nextStep: () => set((state) => ({ step: Math.min(state.step + 1, 6) })),
  prevStep: () => set((state) => ({ step: Math.max(state.step - 1, 1) })),

  reset: () => set(initialState),

  calculateEstimate: () => {
    const state = get()
    let min = 0
    let max = 0

    // Base door price
    switch (state.doorType) {
      case 'barn':
        min += 399
        max += 899
        break
      case 'bifold':
        min += 299
        max += 599
        break
      case 'bypass':
        min += 349
        max += 699
        break
      case 'glass':
        min += 499
        max += 999
        break
    }

    // Material adjustment
    switch (state.material) {
      case 'pine':
        // Base price (no adjustment)
        break
      case 'oak':
        min += 100
        max += 150
        break
      case 'walnut':
        min += 200
        max += 300
        break
      case 'frosted-glass':
        min += 150
        max += 250
        break
      case 'clear-glass':
        min += 100
        max += 200
        break
    }

    // Hardware
    switch (state.hardware) {
      case 'basic':
        min += 99
        max += 149
        break
      case 'premium':
        min += 150
        max += 229
        break
      case 'luxury':
        min += 230
        max += 299
        break
    }

    // Custom size adjustment
    if (state.sizeType === 'custom') {
      min += 100
      max += 200
    }

    // Installation
    if (state.installation) {
      min += 150
      max += 300
    }

    return { min, max }
  },
}))
