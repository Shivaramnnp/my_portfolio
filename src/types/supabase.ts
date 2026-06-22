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
      profiles: {
        Row: {
          id: string
          full_name: string | null
          title: string | null
          bio: string | null
          email: string | null
          updated_at: string | null
        }
        Insert: {
          id: string
          full_name?: string | null
          title?: string | null
          bio?: string | null
          email?: string | null
          updated_at?: string | null
        }
        Update: {
          id?: string
          full_name?: string | null
          title?: string | null
          bio?: string | null
          email?: string | null
          updated_at?: string | null
        }
      }
      projects: {
        Row: {
          id: string
          title: string
          slug: string
          short_description: string | null
          problem_statement: string | null
          solution: string | null
          architecture: string | null
          challenges: string | null
          lessons_learned: string | null
          live_url: string | null
          github_url: string | null
          demo_video_url: string | null
          tech_stack: string[] | null
          is_featured: boolean
          sort_order: number
          created_at: string | null
        }
        Insert: {
          id?: string
          title: string
          slug: string
          short_description?: string | null
          problem_statement?: string | null
          solution?: string | null
          architecture?: string | null
          challenges?: string | null
          lessons_learned?: string | null
          live_url?: string | null
          github_url?: string | null
          demo_video_url?: string | null
          tech_stack?: string[] | null
          is_featured?: boolean
          sort_order?: number
          created_at?: string | null
        }
        Update: {
          id?: string
          title?: string
          slug?: string
          short_description?: string | null
          problem_statement?: string | null
          solution?: string | null
          architecture?: string | null
          challenges?: string | null
          lessons_learned?: string | null
          live_url?: string | null
          github_url?: string | null
          demo_video_url?: string | null
          tech_stack?: string[] | null
          is_featured?: boolean
          sort_order?: number
          created_at?: string | null
        }
      }
      // Add other tables as needed based on initial_schema.sql
    }
  }
}
