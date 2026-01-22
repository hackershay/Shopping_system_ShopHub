export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      products: {
        Row: {
          id: string
          name: string
          description: string
          price: number
          image_url: string
          category: string
          stock: number
          rating: number
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          description: string
          price: number
          image_url: string
          category: string
          stock?: number
          rating?: number
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          description?: string
          price?: number
          image_url?: string
          category?: string
          stock?: number
          rating?: number
          created_at?: string
        }
      }
      orders: {
        Row: {
          id: string
          customer_name: string
          customer_email: string
          customer_phone: string
          shipping_address: string
          total: number
          status: string
          created_at: string
        }
        Insert: {
          id?: string
          customer_name: string
          customer_email: string
          customer_phone: string
          shipping_address: string
          total: number
          status?: string
          created_at?: string
        }
        Update: {
          id?: string
          customer_name?: string
          customer_email?: string
          customer_phone?: string
          shipping_address?: string
          total?: number
          status?: string
          created_at?: string
        }
      }
      order_items: {
        Row: {
          id: string
          order_id: string
          product_id: string
          quantity: number
          price: number
          created_at: string
        }
        Insert: {
          id?: string
          order_id: string
          product_id: string
          quantity: number
          price: number
          created_at?: string
        }
        Update: {
          id?: string
          order_id?: string
          product_id?: string
          quantity?: number
          price?: number
          created_at?: string
        }
      }
    }
  }
}

export type Product = Database['public']['Tables']['products']['Row'];
export type Order = Database['public']['Tables']['orders']['Row'];
export type OrderItem = Database['public']['Tables']['order_items']['Row'];
