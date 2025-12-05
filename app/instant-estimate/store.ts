import { create } from 'zustand'

export type DoorType = 'barn' | 'bifold' | 'bypass' | 'glass'
export type SizeType = 'standard' | 'custom'
export type Material = 'pine' | 'oak' | 'walnut' | 'frosted-glass' | 'clear-glass'
export type Hardware = 'basic' | 'premium' | 'luxury'

export interface PriceBreakdownItem {
  label: string
  min: number
  max: number
  description?: string
}

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
  getPriceBreakdown: () => PriceBreakdownItem[]
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

    // Base door price (for standard 36" x 80" door)
    let basePriceMin = 0
    let basePriceMax = 0

    switch (state.doorType) {
      case 'barn':
        basePriceMin = 399
        basePriceMax = 899
        break
      case 'bifold':
        basePriceMin = 299
        basePriceMax = 599
        break
      case 'bypass':
        basePriceMin = 349
        basePriceMax = 699
        break
      case 'glass':
        basePriceMin = 499
        basePriceMax = 999
        break
    }

    // Calculate size multiplier for custom dimensions
    if (state.sizeType === 'custom' && state.customWidth && state.customHeight) {
      const width = parseFloat(state.customWidth)
      const height = parseFloat(state.customHeight)

      if (!isNaN(width) && !isNaN(height)) {
        // Standard door is 36" x 80" = 2,880 sq inches = 20 sq ft
        const standardSqFt = 20
        const customSqFt = (width * height) / 144 // Convert sq inches to sq ft
        const sizeMultiplier = customSqFt / standardSqFt

        // Apply size multiplier to base price
        basePriceMin = Math.round(basePriceMin * sizeMultiplier)
        basePriceMax = Math.round(basePriceMax * sizeMultiplier)

        // Add custom fabrication fee for non-standard sizes
        min += 100
        max += 200
      }
    }

    min += basePriceMin
    max += basePriceMax

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

    // Installation
    if (state.installation) {
      min += 150
      max += 300
    }

    return { min, max }
  },

  getPriceBreakdown: () => {
    const state = get()
    const breakdown: PriceBreakdownItem[] = []

    // Door type base price
    if (state.doorType) {
      let min = 0, max = 0
      let label = ''

      switch (state.doorType) {
        case 'barn':
          min = 399; max = 899
          label = 'Barn Door (Base)'
          break
        case 'bifold':
          min = 299; max = 599
          label = 'Bifold Door (Base)'
          break
        case 'bypass':
          min = 349; max = 699
          label = 'Bypass Door (Base)'
          break
        case 'glass':
          min = 499; max = 999
          label = 'Glass Door (Base)'
          break
      }

      // Adjust for custom dimensions
      if (state.sizeType === 'custom' && state.customWidth && state.customHeight) {
        const width = parseFloat(state.customWidth)
        const height = parseFloat(state.customHeight)

        if (!isNaN(width) && !isNaN(height)) {
          const standardSqFt = 20
          const customSqFt = (width * height) / 144
          const sizeMultiplier = customSqFt / standardSqFt

          min = Math.round(min * sizeMultiplier)
          max = Math.round(max * sizeMultiplier)
          label = `${label} (${width}" × ${height}")`
        }
      }

      breakdown.push({ label, min, max, description: 'Standard door size is 36" × 80"' })
    }

    // Custom fabrication fee
    if (state.sizeType === 'custom' && state.customWidth && state.customHeight) {
      breakdown.push({
        label: 'Custom Fabrication',
        min: 100,
        max: 200,
        description: 'Additional cost for non-standard sizing'
      })
    }

    // Material upgrade
    if (state.material && state.material !== 'pine') {
      let min = 0, max = 0, label = ''

      switch (state.material) {
        case 'oak':
          min = 100; max = 150
          label = 'Oak Upgrade'
          break
        case 'walnut':
          min = 200; max = 300
          label = 'Walnut Upgrade'
          break
        case 'frosted-glass':
          min = 150; max = 250
          label = 'Frosted Glass Upgrade'
          break
        case 'clear-glass':
          min = 100; max = 200
          label = 'Clear Glass Upgrade'
          break
      }

      if (label) {
        breakdown.push({ label, min, max, description: 'Premium material upgrade' })
      }
    }

    // Hardware
    if (state.hardware) {
      let min = 0, max = 0, label = ''

      switch (state.hardware) {
        case 'basic':
          min = 99; max = 149
          label = 'Basic Hardware'
          break
        case 'premium':
          min = 150; max = 229
          label = 'Premium Hardware'
          break
        case 'luxury':
          min = 230; max = 299
          label = 'Luxury Hardware'
          break
      }

      breakdown.push({ label, min, max, description: 'Includes track, handles, and mounting hardware' })
    }

    // Installation
    if (state.installation) {
      breakdown.push({
        label: 'Professional Installation',
        min: 150,
        max: 300,
        description: 'Certified technician installation service'
      })
    }

    return breakdown
  },
}))
