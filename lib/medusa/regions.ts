import { medusaClient, HttpTypes } from "./config"
import { cache } from "react"

/**
 * Get all available regions
 */
export const getRegions = cache(async (): Promise<HttpTypes.StoreRegion[]> => {
  try {
    const response = await medusaClient.store.region.list()
    return response.regions
  } catch (error) {
    console.error("Error fetching regions:", error)
    return []
  }
})

/**
 * Get a specific region by ID
 */
export const getRegion = cache(async (regionId: string): Promise<HttpTypes.StoreRegion | null> => {
  try {
    const response = await medusaClient.store.region.retrieve(regionId)
    return response.region
  } catch (error) {
    console.error(`Error fetching region ${regionId}:`, error)
    return null
  }
})

/**
 * Get region by country code
 */
export const getRegionByCountryCode = cache(async (countryCode: string): Promise<HttpTypes.StoreRegion | null> => {
  try {
    const regions = await getRegions()
    return regions.find(region => 
      region.countries?.some(country => 
        country.iso_2?.toLowerCase() === countryCode.toLowerCase()
      )
    ) || null
  } catch (error) {
    console.error(`Error fetching region for country ${countryCode}:`, error)
    return null
  }
})

/**
 * Get default region (first available)
 */
export const getDefaultRegion = cache(async (): Promise<HttpTypes.StoreRegion | null> => {
  try {
    const regions = await getRegions()
    return regions[0] || null
  } catch (error) {
    console.error("Error fetching default region:", error)
    return null
  }
})