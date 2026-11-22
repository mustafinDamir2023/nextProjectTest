'use server'

import { pool } from '@/lib/db'
import { Client } from '@/types/db'
import { revalidatePath } from 'next/cache'

// Поиск по name и code (ILIKE = регистронезависимо)
// 👇 ДОБАВЬТЕ ЭТУ СТРОКУ В САМОЕ НАЧАЛО ФУНКЦИИ
export async function getClients(search?: string): Promise<Client[]> {
  'use cache'

  let query = 'SELECT * FROM clients'
  const params: string[] = []

  if (search) {
    query += ' WHERE name ILIKE $1 OR code ILIKE $1'
    params.push(`%${search}%`)
  }

  const { rows } = await pool.query<Client>(query, params)
  return rows
}

export async function createClient(name: string, code: string) {
  const { rows } = await pool.query<Client>(
    'INSERT INTO clients (name, code) VALUES ($1, $2) RETURNING *',
    [name, code]
  )
  revalidatePath('/clients')
  return rows[0]
}

export async function updateClient(id: number, name: string, code: string) {
  await pool.query('UPDATE clients SET name = $1, code = $2 WHERE id = $3', [
    name,
    code,
    id
  ])
  revalidatePath('/clients')
}

export async function deleteClient(id: number) {
  // Защита: сначала удаляем сделки клиента, иначе удаление
  await pool.query('DELETE FROM deals WHERE client_id = $1', [id])
  await pool.query('DELETE FROM clients WHERE id = $1', [id])
  revalidatePath('/clients')
}
