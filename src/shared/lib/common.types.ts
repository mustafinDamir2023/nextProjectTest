export interface Client {
  id: number
  name: string
  code: string
}

export type SelectClient = Pick<Client, 'id' | 'name'>

export interface Deal {
  id: number
  date: string
  number: string
  amount: string
  client_id: number | null
  description: string | null
  client_name?: string | null
}

export interface DealFilters {
  dateFrom?: string
  dateTo?: string
  number?: string
  clientId?: number
}
