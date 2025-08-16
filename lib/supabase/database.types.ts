export interface Database {
  public: {
    Tables: {
      categories: {
        Row: {
          id: string
          name: string
          slug: string
          description: string | null
          image_url: string | null
          parent_id: string | null
          sort_order: number
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          slug: string
          description?: string | null
          image_url?: string | null
          parent_id?: string | null
          sort_order?: number
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          slug?: string
          description?: string | null
          image_url?: string | null
          parent_id?: string | null
          sort_order?: number
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      products: {
        Row: {
          id: string
          name: string
          slug: string
          description: string | null
          short_description: string | null
          sku: string | null
          category_id: string | null
          base_price: number | null
          sale_price: number | null
          cost_price: number | null
          weight: number | null
          dimensions: any | null
          materials: any | null
          finishes: any | null
          features: any | null
          specifications: any | null
          stock_quantity: number
          low_stock_threshold: number
          manage_stock: boolean
          is_active: boolean
          is_featured: boolean
          meta_title: string | null
          meta_description: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          slug: string
          description?: string | null
          short_description?: string | null
          sku?: string | null
          category_id?: string | null
          base_price?: number | null
          sale_price?: number | null
          cost_price?: number | null
          weight?: number | null
          dimensions?: any | null
          materials?: any | null
          finishes?: any | null
          features?: any | null
          specifications?: any | null
          stock_quantity?: number
          low_stock_threshold?: number
          manage_stock?: boolean
          is_active?: boolean
          is_featured?: boolean
          meta_title?: string | null
          meta_description?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          slug?: string
          description?: string | null
          short_description?: string | null
          sku?: string | null
          category_id?: string | null
          base_price?: number | null
          sale_price?: number | null
          cost_price?: number | null
          weight?: number | null
          dimensions?: any | null
          materials?: any | null
          finishes?: any | null
          features?: any | null
          specifications?: any | null
          stock_quantity?: number
          low_stock_threshold?: number
          manage_stock?: boolean
          is_active?: boolean
          is_featured?: boolean
          meta_title?: string | null
          meta_description?: string | null
          created_at?: string
          updated_at?: string
        }
      }
    }
  }
}
