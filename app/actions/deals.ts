'use server'

import { revalidatePath } from 'next/cache'
import { pool } from '@/lib/db'
import { dealSchema } from '@/lib/validations/deal'
import type { Deal, DealFilters, Client } from '@/types/db'

export async function getDeals(filters: DealFilters = {}): Promise<Deal[]> {
  const { dateFrom, dateTo, number, clientId } = filters

  let query = `
    SELECT d.*, c.name AS client_name
    FROM deals d
    LEFT JOIN clients c ON d.client_id = c.id
    WHERE 1=1
  `
  const params: any[] = []
  let i = 1

  if (dateFrom) {
    query += ` AND d.date >= $${i++}`
    params.push(dateFrom)
  }
  if (dateTo) {
    query += ` AND d.date <= $${i++}`
    params.push(dateTo)
  }
  if (number) {
    query += ` AND d.number ILIKE $${i++}`
    params.push(`%${number}%`)
  }
  if (clientId) {
    query += ` AND d.client_id = $${i++}`
    params.push(clientId)
  }

  query += ' ORDER BY d.date DESC, d.id DESC'

  const { rows } = await pool.query(query, params)
  return rows as Deal[]
}

export async function getClientsForSelect(): Promise<
  Pick<Client, 'id' | 'name'>[]
> {
  const { rows } = await pool.query(
    'SELECT id, name FROM clients ORDER BY name'
  )
  return rows
}

export async function createDeal(input: unknown) {
  const data = dealSchema.parse(input)
  const { rows } = await pool.query(
    `INSERT INTO deals (date, number, amount, client_id, description)
     VALUES ($1, $2, $3, $4, $5)
     RETURNING *`,
    [
      data.date,
      data.number,
      data.amount,
      data.client_id,
      data.description || null
    ]
  )
  revalidatePath('/deals')
  return rows[0] as Deal
}

export async function updateDeal(id: number, input: unknown) {
  const data = dealSchema.parse(input)
  const { rows } = await pool.query(
    `UPDATE deals
     SET date = $1, number = $2, amount = $3, client_id = $4, description = $5
     WHERE id = $6
     RETURNING *`,
    [
      data.date,
      data.number,
      data.amount,
      data.client_id,
      data.description || null,
      id
    ]
  )
  revalidatePath('/deals')
  return rows[0] as Deal
}

export async function deleteDeal(id: number) {
  await pool.query('DELETE FROM deals WHERE id = $1', [id])
  revalidatePath('/deals')
}
