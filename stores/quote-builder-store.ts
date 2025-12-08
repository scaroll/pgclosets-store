/**
 * Quote Builder Store
 * Zustand store for managing quote builder state
 */

import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type {
  RoomConfiguration,
  DoorConfiguration,
  QuoteCustomerInfo,
  QuotePropertyInfo,
  QuoteBuilderState,
  DoorType,
  OpeningType
} from '@/types/quote'

const TAX_RATE = 0.13 // 13% HST for Ontario

// Default door configuration
const createDefaultDoor = (): DoorConfiguration => ({
  id: crypto.randomUUID(),
  series: '',
  doorType: 'bypass',
  widthInches: 72,
  heightInches: 80,
  panelCount: 2,
  finish: '',
  hardware: '',
  handles: '',
  softClose: false,
  mirror: false,
  unitPrice: 0,
  quantity: 1,
  lineTotal: 0
})

// Default room configuration
const createDefaultRoom = (name: string = 'Room 1'): RoomConfiguration => ({
  id: crypto.randomUUID(),
  roomName: name,
  openingType: 'closet',
  doors: [createDefaultDoor()],
  photos: []
})

interface QuoteBuilderStore extends QuoteBuilderState {
  // Computed
  subtotal: number
  tax: number
  total: number
  roomCount: number
  doorCount: number

  // Actions - Navigation
  setStep: (step: number) => void
  nextStep: () => void
  prevStep: () => void

  // Actions - Rooms
  addRoom: (name?: string) => void
  removeRoom: (roomId: string) => void
  updateRoom: (roomId: string, updates: Partial<RoomConfiguration>) => void
  duplicateRoom: (roomId: string) => void

  // Actions - Doors
  addDoor: (roomId: string) => void
  removeDoor: (roomId: string, doorId: string) => void
  updateDoor: (roomId: string, doorId: string, updates: Partial<DoorConfiguration>) => void
  duplicateDoor: (roomId: string, doorId: string) => void

  // Actions - Customer & Property
  setCustomer: (customer: QuoteCustomerInfo | null) => void
  setProperty: (property: QuotePropertyInfo | null) => void
  setNotes: (notes: string) => void
  setPreferredDate: (date: string | undefined) => void
  setPreferredTime: (time: string | undefined) => void

  // Actions - Pricing
  calculateDoorPrice: (door: DoorConfiguration) => number
  recalculateTotals: () => void

  // Actions - Reset
  resetQuote: () => void
  clearSavedQuote: () => void

  // Validation
  isStepValid: (step: number) => boolean
  getValidationErrors: (step: number) => string[]
}

// Pricing logic (simplified - can be expanded)
function calculateBaseDoorPrice(door: DoorConfiguration): number {
  // Base price per square foot
  const sqft = (door.widthInches * door.heightInches) / 144
  let basePrice = sqft * 25 // $25 per sqft base

  // Door type multipliers
  const typeMultipliers: Record<DoorType, number> = {
    sliding: 1.0,
    bypass: 1.1,
    bifold: 1.2,
    barn: 1.4,
    pivot: 1.5,
    mirror: 1.3
  }
  basePrice *= typeMultipliers[door.doorType] || 1

  // Panel count adjustment
  basePrice += (door.panelCount - 2) * 50

  // Soft close add-on
  if (door.softClose) {
    basePrice += 75 * door.panelCount
  }

  // Mirror add-on
  if (door.mirror) {
    basePrice += sqft * 15
  }

  return Math.round(basePrice * 100) / 100
}

export const useQuoteBuilder = create<QuoteBuilderStore>()(
  persist(
    (set, get) => ({
      // Initial state
      step: 1,
      rooms: [createDefaultRoom()],
      customer: null,
      property: null,
      notes: '',
      preferredDate: undefined,
      preferredTime: undefined,

      // Computed getters
      get subtotal() {
        return get().rooms.reduce((total, room) => {
          return total + room.doors.reduce((roomTotal, door) => {
            return roomTotal + door.lineTotal
          }, 0)
        }, 0)
      },

      get tax() {
        return Math.round(get().subtotal * TAX_RATE * 100) / 100
      },

      get total() {
        return Math.round((get().subtotal + get().tax) * 100) / 100
      },

      get roomCount() {
        return get().rooms.length
      },

      get doorCount() {
        return get().rooms.reduce((count, room) => count + room.doors.length, 0)
      },

      // Navigation
      setStep: (step) => set({ step }),

      nextStep: () => {
        const { step, isStepValid } = get()
        if (isStepValid(step) && step < 5) {
          set({ step: step + 1 })
        }
      },

      prevStep: () => {
        const { step } = get()
        if (step > 1) {
          set({ step: step - 1 })
        }
      },

      // Room actions
      addRoom: (name) => {
        const { rooms } = get()
        const newRoom = createDefaultRoom(name || `Room ${rooms.length + 1}`)
        set({ rooms: [...rooms, newRoom] })
      },

      removeRoom: (roomId) => {
        const { rooms } = get()
        if (rooms.length > 1) {
          set({ rooms: rooms.filter((r) => r.id !== roomId) })
        }
      },

      updateRoom: (roomId, updates) => {
        const { rooms } = get()
        set({
          rooms: rooms.map((room) =>
            room.id === roomId ? { ...room, ...updates } : room
          )
        })
      },

      duplicateRoom: (roomId) => {
        const { rooms } = get()
        const room = rooms.find((r) => r.id === roomId)
        if (room) {
          const newRoom: RoomConfiguration = {
            ...room,
            id: crypto.randomUUID(),
            roomName: `${room.roomName} (Copy)`,
            doors: room.doors.map((door) => ({
              ...door,
              id: crypto.randomUUID()
            }))
          }
          set({ rooms: [...rooms, newRoom] })
        }
      },

      // Door actions
      addDoor: (roomId) => {
        const { rooms, recalculateTotals } = get()
        set({
          rooms: rooms.map((room) =>
            room.id === roomId
              ? { ...room, doors: [...room.doors, createDefaultDoor()] }
              : room
          )
        })
        recalculateTotals()
      },

      removeDoor: (roomId, doorId) => {
        const { rooms, recalculateTotals } = get()
        set({
          rooms: rooms.map((room) =>
            room.id === roomId
              ? {
                  ...room,
                  doors: room.doors.length > 1
                    ? room.doors.filter((d) => d.id !== doorId)
                    : room.doors
                }
              : room
          )
        })
        recalculateTotals()
      },

      updateDoor: (roomId, doorId, updates) => {
        const { rooms, calculateDoorPrice } = get()
        set({
          rooms: rooms.map((room) =>
            room.id === roomId
              ? {
                  ...room,
                  doors: room.doors.map((door) => {
                    if (door.id !== doorId) return door
                    const updated = { ...door, ...updates }
                    const unitPrice = calculateDoorPrice(updated)
                    return {
                      ...updated,
                      unitPrice,
                      lineTotal: unitPrice * updated.quantity
                    }
                  })
                }
              : room
          )
        })
      },

      duplicateDoor: (roomId, doorId) => {
        const { rooms, recalculateTotals } = get()
        set({
          rooms: rooms.map((room) => {
            if (room.id !== roomId) return room
            const door = room.doors.find((d) => d.id === doorId)
            if (!door) return room
            return {
              ...room,
              doors: [...room.doors, { ...door, id: crypto.randomUUID() }]
            }
          })
        })
        recalculateTotals()
      },

      // Customer & Property
      setCustomer: (customer) => set({ customer }),
      setProperty: (property) => set({ property }),
      setNotes: (notes) => set({ notes }),
      setPreferredDate: (preferredDate) => set({ preferredDate }),
      setPreferredTime: (preferredTime) => set({ preferredTime }),

      // Pricing
      calculateDoorPrice: (door) => calculateBaseDoorPrice(door),

      recalculateTotals: () => {
        const { rooms, calculateDoorPrice } = get()
        set({
          rooms: rooms.map((room) => ({
            ...room,
            doors: room.doors.map((door) => {
              const unitPrice = calculateDoorPrice(door)
              return {
                ...door,
                unitPrice,
                lineTotal: unitPrice * door.quantity
              }
            })
          }))
        })
      },

      // Reset
      resetQuote: () => {
        set({
          step: 1,
          rooms: [createDefaultRoom()],
          customer: null,
          property: null,
          notes: '',
          preferredDate: undefined,
          preferredTime: undefined
        })
      },

      clearSavedQuote: () => {
        localStorage.removeItem('pg-closets-quote-builder')
        get().resetQuote()
      },

      // Validation
      isStepValid: (step) => {
        const { rooms, customer, property } = get()

        switch (step) {
          case 1: // Room configuration
            return rooms.length > 0 && rooms.every((room) =>
              room.roomName.trim() !== '' &&
              room.doors.length > 0 &&
              room.doors.every((door) =>
                door.series !== '' &&
                door.doorType !== '' &&
                door.widthInches > 0 &&
                door.heightInches > 0
              )
            )

          case 2: // Door details (finishes, hardware)
            return rooms.every((room) =>
              room.doors.every((door) =>
                door.finish !== '' &&
                door.hardware !== '' &&
                door.handles !== ''
              )
            )

          case 3: // Customer info
            return customer !== null &&
              customer.name.trim() !== '' &&
              customer.email.trim() !== '' &&
              customer.phone.trim() !== ''

          case 4: // Property info
            return property !== null &&
              property.address.line1.trim() !== '' &&
              property.address.city.trim() !== '' &&
              property.address.province.trim() !== '' &&
              property.address.postalCode.trim() !== ''

          case 5: // Review
            return get().isStepValid(1) &&
              get().isStepValid(2) &&
              get().isStepValid(3) &&
              get().isStepValid(4)

          default:
            return false
        }
      },

      getValidationErrors: (step) => {
        const errors: string[] = []
        const { rooms, customer, property } = get()

        switch (step) {
          case 1:
            if (rooms.length === 0) {
              errors.push('Add at least one room')
            }
            rooms.forEach((room, i) => {
              if (!room.roomName.trim()) {
                errors.push(`Room ${i + 1}: Name is required`)
              }
              if (room.doors.length === 0) {
                errors.push(`Room ${i + 1}: Add at least one door`)
              }
              room.doors.forEach((door, j) => {
                if (!door.series) {
                  errors.push(`Room ${i + 1}, Door ${j + 1}: Select a series`)
                }
                if (door.widthInches <= 0) {
                  errors.push(`Room ${i + 1}, Door ${j + 1}: Enter valid width`)
                }
                if (door.heightInches <= 0) {
                  errors.push(`Room ${i + 1}, Door ${j + 1}: Enter valid height`)
                }
              })
            })
            break

          case 2:
            rooms.forEach((room, i) => {
              room.doors.forEach((door, j) => {
                if (!door.finish) {
                  errors.push(`Room ${i + 1}, Door ${j + 1}: Select a finish`)
                }
                if (!door.hardware) {
                  errors.push(`Room ${i + 1}, Door ${j + 1}: Select hardware`)
                }
                if (!door.handles) {
                  errors.push(`Room ${i + 1}, Door ${j + 1}: Select handles`)
                }
              })
            })
            break

          case 3:
            if (!customer) {
              errors.push('Enter your contact information')
            } else {
              if (!customer.name.trim()) errors.push('Name is required')
              if (!customer.email.trim()) errors.push('Email is required')
              if (!customer.phone.trim()) errors.push('Phone is required')
            }
            break

          case 4:
            if (!property) {
              errors.push('Enter your property address')
            } else {
              if (!property.address.line1.trim()) errors.push('Street address is required')
              if (!property.address.city.trim()) errors.push('City is required')
              if (!property.address.province.trim()) errors.push('Province is required')
              if (!property.address.postalCode.trim()) errors.push('Postal code is required')
            }
            break
        }

        return errors
      }
    }),
    {
      name: 'pg-closets-quote-builder',
      partialize: (state) => ({
        step: state.step,
        rooms: state.rooms,
        customer: state.customer,
        property: state.property,
        notes: state.notes,
        preferredDate: state.preferredDate,
        preferredTime: state.preferredTime
      })
    }
  )
)
