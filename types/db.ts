// types/db.ts
export interface Client {
  id: number
  name: string
  code: string
}

export interface Deal {
  id: number
  date: string // pg возвращает DATE как строку 'YYYY-MM-DD'
  number: string
  amount: string // NUMERIC приходит строкой — важно!
  client_id: number | null
  description: string | null
  client_name?: string | null // из JOIN
}

export interface DealFilters {
  dateFrom?: string
  dateTo?: string
  number?: string
  clientId?: number
}
