'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation' // 👈 Добавили хук роутера
import { deleteClient } from '@/app/actions/clients'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog'
import type { Client } from '@/types/db'
import { TrashIcon } from 'lucide-react'

export function DeleteClientButton({ client }: { client: Client }) {
  // 👈 Убрали onDone
  const [open, setOpen] = useState(false)
  const [busy, setBusy] = useState(false)
  const router = useRouter() // 👈 Инициализировали роутер

  const handleDelete = async () => {
    setBusy(true)
    await deleteClient(client.id) // На сервере сработает revalidatePath
    router.refresh() // 👈 Заставляем клиент обновить данные с сервера
    setBusy(false)
    setOpen(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger>
        <Button variant='ghost' size='sm' className='text-red-600'>
          <TrashIcon />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Удалить клиента?</DialogTitle>
          <DialogDescription>
            Клиент «{client.name}» и все его сделки будут удалены безвозвратно.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant='outline' onClick={() => setOpen(false)}>
            Отмена
          </Button>
          <Button variant='destructive' onClick={handleDelete} disabled={busy}>
            {busy ? 'Удаление…' : 'Удалить'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
