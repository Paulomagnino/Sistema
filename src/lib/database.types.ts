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
      projects: {
        Row: {
          id: string
          name: string
          client: string
          start_date: string
          end_date: string
          budget: number
          status: 'em_andamento' | 'concluido' | 'atrasado'
          description: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          client: string
          start_date: string
          end_date: string
          budget: number
          status: 'em_andamento' | 'concluido' | 'atrasado'
          description?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          client?: string
          start_date?: string
          end_date?: string
          budget?: number
          status?: 'em_andamento' | 'concluido' | 'atrasado'
          description?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      // Adicione outras tabelas aqui...
    }
  }
}